import React from "react";
import { DateRange } from "../type";

interface CalendarProps {
  currentDate: Date;
  calendarDays: Date[];
  selectedRange: DateRange;
  highlightedDates: Date[];
  handleDateClick: (date: Date) => void;
  getDaysInMonth: (year: number, month: number) => number;
  getFirstDayOfMonth: (year: number, month: number) => number;
  isWeekend: (date: Date) => boolean;
  isWeekday: (date: Date) => boolean;
  isTodayCalendar?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  calendarDays,
  selectedRange,
  highlightedDates,
  handleDateClick,
  getDaysInMonth,
  getFirstDayOfMonth,
  isWeekend,
  isWeekday,
  isTodayCalendar = false,
}) => {
  const today = new Date();

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({
            length: Math.ceil(calendarDays.length / 7),
          }).map((_, weekIndex) => (
            <tr key={weekIndex}>
              {calendarDays
                .slice(weekIndex * 7, (weekIndex + 1) * 7)
                .map((date, dayIndex) => {
                  const isCurrentMonth =
                    date.getMonth() === currentDate.getMonth();
                  const isDisabled = !isCurrentMonth || isWeekend(date);
                  const isToday = date.toDateString() === today.toDateString();

                  const isHighlighted = highlightedDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  );

                  return (
                    <td
                      key={dayIndex}
                      onClick={() => !isDisabled && handleDateClick(date)}
                      style={{
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        backgroundColor:
                          isHighlighted && isCurrentMonth
                            ? "#ff7b00"
                            : isToday && isTodayCalendar
                            ? "#70d6ff"
                            : isCurrentMonth
                            ? "#99c1de"
                            : "#d6e2e9",
                        color:
                          isToday && isTodayCalendar
                            ? "blue"
                            : isDisabled
                            ? "black"
                            : "inherit",
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      {date.getDate() < 0 ? "" : date.getDate()}
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
