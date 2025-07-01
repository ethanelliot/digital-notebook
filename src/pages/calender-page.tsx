import Calendar from "@/components/dashboard/calendar/calendar";
import React from "react";

const CalendarPage: React.FC = () => {
  return (
    <div className="container mx-auto h-full flex flex-col">
      <p className="text-3xl font-bold mb-4">Calendar</p>
      <div className="flex flex-1">
        <Calendar />
      </div>
    </div>
  );
};

export default CalendarPage;
