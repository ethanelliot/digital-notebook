"""
Syncs Moodle calendar events to Firestore as notes.

Adapted from a Notion sync script written in April 2025.

Required environment variables (set in .env locally or as GitHub Actions secrets):
  FIREBASE_SERVICE_ACCOUNT      - Firebase service account JSON (as a string)
  FIREBASE_SERVICE_ACCOUNT_PATH - Path to service account JSON file (default: service-account.json)
  CREATED_BY                    - Firestore user ID to associate with created notes
  ICS_URLS                      - Comma-separated Moodle ICS export URL(s)
"""

import re
import os
import json
import logging
from datetime import datetime, timezone
from typing import TypedDict

import requests
from ics import Calendar, Event
import firebase_admin
from firebase_admin import credentials, firestore as admin_firestore
from google.cloud.firestore import Client as FirestoreClient
from dotenv import load_dotenv


logging.basicConfig(level=logging.INFO)
load_dotenv()

CREATED_BY = os.environ["CREATED_BY"]

# Todo: Find better way to set these. Will link to UI interface at some point hopefully
COURSE_TO_GROUP = {
    "SENG301": "zZZgBD8ZbB0Rbjh2XNK4",
    "SENG365": "e04SX3QH6IJmo85a7dFF",
    "DATA301": "PVORtyrNCSPYb2VViAiT",
}

ICS_URLS = os.environ["ICS_URLS"].split(",")


class CalendarEvent(TypedDict):
    ics_uid: str
    content: str
    due_date: datetime
    course_code: str


class CalendarEventUpdate(CalendarEvent):
    firestore_id: str


class FirestoreRecord(TypedDict):
    id: str
    due_date: datetime


def init_firebase() -> FirestoreClient:
    """Initialize Firebase from FIREBASE_SERVICE_ACCOUNT env var (JSON string,
    suitable for GitHub Actions secrets) or fall back to a local file path
    set via FIREBASE_SERVICE_ACCOUNT_PATH (defaults to service-account.json)."""
    sa_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT")
    if sa_json:
        cred = credentials.Certificate(json.loads(sa_json))
    else:
        sa_path = os.environ.get(
            "FIREBASE_SERVICE_ACCOUNT_PATH", "service-account.json"
        )
        cred = credentials.Certificate(sa_path)
    firebase_admin.initialize_app(cred)
    return admin_firestore.client()


def fetch_calendar() -> Calendar:
    merged_cal = Calendar()
    for url in ICS_URLS:
        logging.info("Getting ICS from %s", url)
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        cal = Calendar(resp.text)
        merged_cal.events.update(cal.events)
        logging.info("Successfully added events to merged calendar")
    return merged_cal


def extract_course_code(categories: frozenset[str]) -> str:
    pattern = r"^[A-Za-z]{4}\d{3}-(\d{2}|\d{4})S\d$"
    class_code = next((c for c in categories if re.match(pattern, c)), "")
    return class_code.split("-")[0]


def format_name(name: str) -> str:
    pattern = re.compile(r"^(?:Quiz\s*)?(\d+)[^\w]*(.*)", re.IGNORECASE)
    match = pattern.match(name)
    if not match:
        return name.removesuffix("closes")
    quiz_number = int(match.group(1))
    remaining_text = match.group(2).strip().removesuffix("closes")
    return f"Quiz {quiz_number} \u2013 {remaining_text}"


def parse_event(event: Event) -> CalendarEvent:
    return CalendarEvent(
        ics_uid=event.uid,
        content=format_name(event.name),
        due_date=event.end.datetime,
        course_code=extract_course_code(event.categories),
    )


def fetch_upcoming_notes(db: FirestoreClient) -> dict[str, FirestoreRecord]:
    """Return a dict of {ics_uid: {id, due_date}} for all upcoming script-managed notes."""
    now = datetime.now(timezone.utc)
    results = (
        db.collection("notes")
        .where(field_path="dueDate", op_string=">", value=now)
        .stream()
    )

    existing: dict[str, FirestoreRecord] = {}
    for doc in results:
        data = doc.to_dict()
        ics_uid = data.get("ics_uid", "")
        if ics_uid:  # skip empty strings
            existing[ics_uid] = FirestoreRecord(id=doc.id, due_date=data.get("dueDate"))
    return existing


def is_actionable(event: CalendarEvent) -> bool:
    """Filter out opens events, past events, and unknown courses."""
    return (
        not event["content"].endswith("opens")
        and event["due_date"] >= datetime.now(timezone.utc)
        and event["course_code"] in COURSE_TO_GROUP
    )


def partition_events(
    db: FirestoreClient, cal: Calendar
) -> tuple[list[CalendarEvent], list[CalendarEventUpdate]]:
    upcoming = fetch_upcoming_notes(db)
    logging.info("upcoming notes in firestore: %s", upcoming)

    events = list(filter(is_actionable, map(parse_event, cal.events)))
    logging.info("actionable events: %s", events)

    new: list[CalendarEvent] = []
    updates: list[CalendarEventUpdate] = []
    for event in events:
        if existing := upcoming.get(event["ics_uid"]):
            if existing["due_date"] != event["due_date"]:
                updates.append(
                    CalendarEventUpdate(**event, firestore_id=existing["id"])
                )
        else:
            new.append(event)

    return new, updates


def create_notes(db: FirestoreClient, events: list[CalendarEvent]) -> None:
    notes_ref = db.collection("notes")
    groups_ref = db.collection("groups")
    for event in events:
        group_ref = groups_ref.document(COURSE_TO_GROUP[event["course_code"]])
        notes_ref.add(
            {
                "ics_uid": event["ics_uid"],
                "content": event["content"],
                "status": "Not-started",
                "dueDate": event["due_date"],
                "groupRef": group_ref,
                "createdBy": CREATED_BY,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now(),
            }
        )
        logging.info("Created note: %s", event["content"])


def update_notes(db: FirestoreClient, events: list[CalendarEventUpdate]) -> None:
    notes_ref = db.collection("notes")
    for event in events:
        notes_ref.document(event["firestore_id"]).update(
            {
                "content": event["content"],
                "dueDate": event["due_date"],
                "updatedAt": datetime.now(),
            }
        )
        logging.info("Updated note: %s", event["content"])


def main() -> None:
    db = init_firebase()
    cal = fetch_calendar()
    new, updates = partition_events(db, cal)
    create_notes(db, new)
    update_notes(db, updates)
    logging.info("Done: %d created, %d updated.", len(new), len(updates))


if __name__ == "__main__":
    main()
