import { useCallback, useEffect, useRef, useState } from "react";
import WeekdayDateRangePicker from "./components/WeekdayDateRangePicker/WeekdayDateRangePicker";

function App() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [weekendDates, setWeekendDates] = useState<Date[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleDateRangeChange = useCallback(
    (range: [Date | null, Date | null], weekends: Date[]) => {
      setDateRange(range);
      setWeekendDates(weekends);
      setShowPicker(false);
    },
    []
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        paddingLeft: "40px",
        paddingRight: "40px",
      }}
    >
      <div
        style={{ position: "relative", display: "inline-block" }}
        ref={inputRef}
      >
        {/* Input Field with Calendar Icon */}
        <div
          onClick={() => setShowPicker(!showPicker)}
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "4px",
            cursor: "pointer",
            width: "250px",
          }}
        >
          <span>
            {dateRange[0] && dateRange[1]
              ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
              : "Select Date Range"}
          </span>
          <span style={{ marginLeft: "auto", fontSize: "18px" }}>📅</span>
        </div>
        {showPicker && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: 0,
              background: "#fff",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "4px",
              zIndex: 10,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <WeekdayDateRangePicker
              onChange={handleDateRangeChange}
              preSetDateRange={dateRange}
            />
          </div>
        )}
      </div>
      <div>
        <p>
          Selected Range: {dateRange[0]?.toLocaleDateString() || "DD/MM/YYYY"} -{" "}
          {dateRange[1]?.toLocaleDateString() || "DD/MM/YYYY"}
        </p>
        <p>
          Weekend Dates:{" "}
          {weekendDates.map((date) => date.toLocaleDateString()).join(", ") ||
            "DD/MM/YYYY"}
        </p>
      </div>
    </div>
  );
}

export default App;
