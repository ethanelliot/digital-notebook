import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isToday,
  startOfMonth,
  startOfWeek,
  isSameMonth,
  format,
  subMonths,
  addMonths,
  addWeeks,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const views = [
  {
    name: "Month",
    value: "month",
  },
  {
    name: "Week",
    value: "week",
  },
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    let startDate: Date;
    let endDate: Date;
    if (view === "month") {
      // Calculate all days of the current month grid
      startDate = startOfWeek(startOfMonth(currentDate), {
        weekStartsOn: 1,
      });
      endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    } else {
      // if (view === "week")
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    }

    setDays(eachDayOfInterval({ start: startDate, end: endDate }));
  }, [view, currentDate]);

  console.log(days);

  return (
    <div className="flex-1 grid grid-rows-[4rem_1fr] mb-6">
      <div className=" flex justify-between">
        <div className="flex justify-between items-center mb-4 gap-2">
          <Button
            variant={"outline"}
            onClick={() => {
              if (view === "month") {
                setCurrentDate(subMonths(currentDate, 1));
              } else {
                setCurrentDate(subWeeks(currentDate, 1));
              }
            }}
          >
            <ChevronLeft />
          </Button>
          <p className="text-xl w-40 text-center">
            {format(currentDate, "MMMM yyyy")}
          </p>
          <Button
            variant={"outline"}
            onClick={() => {
              if (view === "month") {
                setCurrentDate(addMonths(currentDate, 1));
              } else {
                setCurrentDate(addWeeks(currentDate, 1));
              }
            }}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex gap-2 ">
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "month" | "week")}
          >
            <TabsList className="p-1 h-auto bg-background gap-1 border">
              {views.map((view) => {
                return (
                  <TabsTrigger
                    key={view.value}
                    value={view.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {view.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          <Button>
            <Plus />
            <span>Add</span>
          </Button>
        </div>
      </div>
      {view === "month" && (
        <div className="grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="font-bold text-center">
              {day}
            </div>
          ))}
          {days.map((day) => (
            <div
              key={day.toString()}
              className={`p-2 aspect-square border rounded-md hover:cursor-pointer  $ ${
                !isSameMonth(day, currentDate) ? "opacity-30" : ""
              }`}
            >
              <p
                className={`h-6 w-6 flex items-center justify-center text-sm font-bold ${
                  isToday(day)
                    ? "bg-primary text-primary-foreground rounded-full"
                    : ""
                }`}
              >
                {format(day, "d")}
              </p>
              <div>{/* content */}</div>
            </div>
          ))}
        </div>
      )}
      {view === "week" && (
        <div className=" grid grid-cols-7 grid-rows-[auto_1fr] gap-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="h-6 font-bold text-center">
              {day}
            </div>
          ))}
          {days.map((day) => (
            <div className="flex flex-col justify-center items-center gap-2">
              <p
                className={`h-6 w-6 flex items-center justify-center text-sm font-bold ${
                  isToday(day)
                    ? "bg-primary text-primary-foreground rounded-full"
                    : ""
                }`}
              >
                {format(day, "d")}
              </p>
              <div
                key={day.toString()}
                className={
                  "p-2 w-full h-full border rounded-md hover:cursor-pointer"
                }
              >
                <div>{/* content */}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
