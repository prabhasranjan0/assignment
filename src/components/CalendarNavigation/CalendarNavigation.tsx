import React from "react";

interface CalendarNavigationProps {
  monthName: string;
  year: number;
  handlePrevYear: () => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleNextYear: () => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  monthName,
  year,
  handlePrevYear,
  handlePrevMonth,
  handleNextMonth,
  handleNextYear,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <button onClick={handlePrevYear}>{`<<`}</button>
      <button onClick={handlePrevMonth}>{"<"}</button>
      <div
        style={{
          textAlign: "center",
          paddingTop: "10px",
          paddingBottom: "10px",
          flexGrow: 1,
          minWidth: "100px",
        }}
      >
        {monthName} {year}
      </div>
      <button onClick={handleNextMonth}>{">"}</button>
      <button onClick={handleNextYear}>{">>"}</button>
    </div>
  );
};

export default CalendarNavigation;
