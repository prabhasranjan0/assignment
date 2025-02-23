import React, { useState, useEffect, useCallback, useMemo } from "react";
import Calendar from "../Calendar/Calendar";
import CalendarNavigation from "../CalendarNavigation/CalendarNavigation";
import PredefinedRanges from "../PredefinedRanges/PredefinedRanges";
import { DateRange as DateRangeType } from "../type";
import { PREDEFINED_RANGES } from "../constants";

interface Props {
  onChange?: (range: [Date | null, Date | null], weekends: Date[]) => void;
  preSetDateRange?: [Date | null, Date | null];
}

const WeekdayDateRangePicker: React.FC<Props> = ({
  onChange,
  preSetDateRange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentDateNextCalender, setCurrentDateNextCalender] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );
  const [dateSelection, setDateSelection] = useState<{
    selectedRange: DateRangeType;
    highlightedDates: Date[];
  }>({
    selectedRange: {
      startDate: null,
      endDate: null,
    },
    highlightedDates: [],
  });

  const { selectedRange, highlightedDates } = dateSelection;

  const getDaysInMonth = useCallback((year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback(
    (year: number, month: number): number => {
      return new Date(year, month, 1).getDay();
    },
    []
  );

  const isWeekend = useCallback((date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  }, []);

  const isWeekday = useCallback((date: Date): boolean => {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  }, []);

  const generateCalendarDays = useCallback(
    (date: Date): Date[] => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const daysInMonthOfPreviousMonth = new Date(year, month, 0).getDate();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDayOfMonth = getFirstDayOfMonth(year, month);

      const days: Date[] = [];

      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, daysInMonthOfPreviousMonth - i));
      }

      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }

      return days;
    },
    [getDaysInMonth, getFirstDayOfMonth]
  );

  const handleDateClick = useCallback(
    (date: Date) => {
      if (isWeekend(date)) {
        return;
      }

      setDateSelection((prevState) => {
        let newStartDate = prevState.selectedRange.startDate;
        let newEndDate = prevState.selectedRange.endDate;
        let newHighlightedDates: Date[] = [];

        if (!prevState.selectedRange.startDate) {
          newStartDate = date;
          newEndDate = null;
          newHighlightedDates = [date];
        } else if (!prevState.selectedRange.endDate) {
          if (date < prevState.selectedRange.startDate) {
            newStartDate = date;
            newEndDate = null;
            newHighlightedDates = [date];
          } else {
            newEndDate = date;
            const startDate = prevState.selectedRange.startDate;
            const endDate = date;
            const tempHighlightedDates: Date[] = [];

            let currentDateIter = new Date(startDate.getTime());
            while (currentDateIter <= endDate) {
              if (isWeekday(currentDateIter)) {
                tempHighlightedDates.push(new Date(currentDateIter.getTime()));
              }
              currentDateIter.setDate(currentDateIter.getDate() + 1);
            }
            newHighlightedDates = tempHighlightedDates;
          }
        } else {
          newStartDate = date;
          newEndDate = null;
          newHighlightedDates = [date];
        }
        return {
          selectedRange: { startDate: newStartDate, endDate: newEndDate },
          highlightedDates: newHighlightedDates,
        };
      });
    },
    [isWeekend, isWeekday]
  );

  useEffect(() => {
    if (selectedRange.startDate && selectedRange.endDate) {
      const weekends: Date[] = [];
      let currentDateIter = new Date(selectedRange.startDate.getTime());
      while (currentDateIter <= selectedRange.endDate) {
        if (isWeekend(currentDateIter)) {
          weekends.push(new Date(currentDateIter.getTime()));
        }
        currentDateIter.setDate(currentDateIter.getDate() + 1);
      }
    }
  }, [selectedRange, isWeekend]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  }, [currentDate]);

  const applyPredefinedRange = useCallback(
    (startDate: Date, endDate: Date) => {
      setCurrentDate(startDate);
      const tempHighlightedDates: Date[] = [];
      let currentDateIter = new Date(startDate.getTime());
      while (currentDateIter <= endDate) {
        if (isWeekday(currentDateIter)) {
          tempHighlightedDates.push(new Date(currentDateIter.getTime()));
        }
        currentDateIter.setDate(currentDateIter.getDate() + 1);
      }
      setDateSelection({
        selectedRange: { startDate: startDate, endDate: endDate },
        highlightedDates: tempHighlightedDates,
      });

      setCurrentDateNextCalender(
        new Date(startDate).getMonth() === new Date(endDate).getMonth() &&
          new Date(startDate).getFullYear() === new Date(endDate).getFullYear()
          ? new Date(new Date(endDate).setMonth(new Date().getMonth() + 1))
          : new Date(
              endDate.getFullYear(),
              endDate.getMonth(),
              endDate.getDate()
            )
      );
      setCurrentDate(startDate);
    },
    [isWeekday, setDateSelection]
  );

  useEffect(() => {
    if (preSetDateRange && preSetDateRange[0] && preSetDateRange[1]) {
      applyPredefinedRange(preSetDateRange[0], preSetDateRange[1]);
    }
  }, [preSetDateRange, applyPredefinedRange]);

  const handleNextMonth = useCallback(() => {
    const areConsecutive = (date1: Date, date2: Date): boolean => {
      const nextMonth = new Date(date1.getFullYear(), date1.getMonth() + 1, 1);
      return (
        nextMonth.getFullYear() === date2.getFullYear() &&
        nextMonth.getMonth() === date2.getMonth()
      );
    };
    if (areConsecutive(currentDate, currentDateNextCalender)) {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
      );
      setCurrentDateNextCalender(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 2)
      );
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
      );
    }
  }, [currentDate, currentDateNextCalender]);

  const handlePrevYear = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear() - 1, currentDate.getMonth())
    );
  }, [currentDate]);

  const handleNextYear = useCallback(() => {
    const areConsecutiveYears = (date1: Date, date2: Date): boolean => {
      return (
        date1.getFullYear() + 1 === date2.getFullYear() ||
        date1.getFullYear() === date2.getFullYear()
      );
    };
    if (areConsecutiveYears(currentDate, currentDateNextCalender)) {
      setCurrentDate(
        new Date(currentDate.getFullYear() + 1, currentDate.getMonth())
      );
      setCurrentDateNextCalender(
        new Date(currentDate.getFullYear() + 1, currentDate.getMonth() + 1)
      );
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear() + 1, currentDate.getMonth())
      );
    }
  }, [currentDate, currentDateNextCalender]);

  const handlePrevMonthSecondCalender = useCallback(() => {
    const areConsecutive = (date1: Date, date2: Date): boolean => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() + 1 === date2.getMonth()
      );
    };

    const newYear = currentDateNextCalender.getFullYear();
    const newMonth = currentDateNextCalender.getMonth() - 1;
    const newDateForNextCalender = new Date(newYear, newMonth);

    if (newDateForNextCalender <= currentDate) {
      const newCurrentDate = new Date(
        newDateForNextCalender.getFullYear(),
        newDateForNextCalender.getMonth() - 1
      );
      setCurrentDate(newCurrentDate);
      setCurrentDateNextCalender(newDateForNextCalender);
      return;
    }

    if (areConsecutive(currentDate, currentDateNextCalender)) {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
      );
      setCurrentDateNextCalender(
        new Date(
          currentDateNextCalender.getFullYear(),
          currentDateNextCalender.getMonth() - 1
        )
      );
    } else {
      setCurrentDateNextCalender(newDateForNextCalender);
    }
  }, [currentDate, currentDateNextCalender]);

  const handleNextMonthSecondCalender = useCallback(() => {
    setCurrentDateNextCalender(
      new Date(
        currentDateNextCalender.getFullYear(),
        currentDateNextCalender.getMonth() + 1
      )
    );
  }, [currentDateNextCalender]);

  const handlePrevYearSecondCalender = useCallback(() => {
    const areConsecutive = (date1: Date, date2: Date): boolean => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() + 1 === date2.getMonth()
      );
    };

    const newYear = currentDateNextCalender.getFullYear() - 1;
    const newMonth = currentDateNextCalender.getMonth();
    const newDateForNextCalender = new Date(newYear, newMonth);

    if (newDateForNextCalender <= currentDate) {
      const newCurrentDate = new Date(
        newDateForNextCalender.getFullYear(),
        newDateForNextCalender.getMonth() - 1
      );
      setCurrentDate(newCurrentDate);
      setCurrentDateNextCalender(newDateForNextCalender);
      return;
    }

    if (areConsecutive(currentDate, currentDateNextCalender)) {
      setCurrentDate(
        new Date(
          currentDateNextCalender.getFullYear() - 1,
          currentDateNextCalender.getMonth()
        )
      );
      setCurrentDateNextCalender(
        new Date(
          currentDateNextCalender.getFullYear() - 1,
          currentDateNextCalender.getMonth()
        )
      );
    } else {
      setCurrentDateNextCalender(newDateForNextCalender);
    }
  }, [currentDate, currentDateNextCalender]);

  const handleNextYearSecondCalender = useCallback(() => {
    setCurrentDateNextCalender(
      new Date(
        currentDateNextCalender.getFullYear() + 1,
        currentDateNextCalender.getMonth()
      )
    );
  }, [currentDateNextCalender]);

  const calendarDaysCurrent = useMemo(
    () => generateCalendarDays(currentDate),
    [generateCalendarDays, currentDate]
  );

  const nextMonthDate = useMemo(
    () =>
      new Date(
        currentDateNextCalender.getFullYear(),
        currentDateNextCalender.getMonth()
      ),
    [currentDateNextCalender]
  );
  const calendarDaysNext = useMemo(
    () => generateCalendarDays(nextMonthDate),
    [generateCalendarDays, nextMonthDate]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = new Date(year, month, 1).toLocaleString("default", {
    month: "long",
  });

  const nextYear = nextMonthDate.getFullYear();
  const nextMonth = nextMonthDate.getMonth();

  const nextMonthName = new Date(nextYear, nextMonth, 1).toLocaleString(
    "default",
    {
      month: "long",
    }
  );

  const handleApply = useCallback(() => {
    if (selectedRange.startDate && selectedRange.endDate) {
      const weekends: Date[] = [];
      let currentDateIter = new Date(selectedRange.startDate.getTime());
      while (currentDateIter <= selectedRange.endDate) {
        if (isWeekend(currentDateIter)) {
          weekends.push(new Date(currentDateIter.getTime()));
        }
        currentDateIter.setDate(currentDateIter.getDate() + 1);
      }

      onChange &&
        onChange([selectedRange.startDate, selectedRange.endDate], weekends);
    } else {
      onChange && onChange([null, null], []);
    }
  }, [selectedRange, onChange, isWeekend]);

  return (
    <div style={{ display: "flex", gap: 20, flexDirection: "column" }}>
      <div style={{ paddingTop: 5, paddingBottom: 5 }}>
        {`${
          selectedRange.startDate
            ? selectedRange.startDate.toLocaleDateString()
            : "DD/MM/YYYY"
        } - ${
          selectedRange.endDate
            ? selectedRange.endDate.toLocaleDateString()
            : "DD/MM/YYYY"
        }`}
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <CalendarNavigation
            monthName={monthName}
            year={year}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            handlePrevYear={handlePrevYear}
            handleNextYear={handleNextYear}
          />
          <Calendar
            currentDate={currentDate}
            calendarDays={calendarDaysCurrent}
            selectedRange={selectedRange}
            highlightedDates={highlightedDates}
            handleDateClick={handleDateClick}
            getDaysInMonth={getDaysInMonth}
            getFirstDayOfMonth={getFirstDayOfMonth}
            isWeekend={isWeekend}
            isWeekday={isWeekday}
            isTodayCalendar={true}
          />
        </div>
        <div style={{ flex: 1 }}>
          <CalendarNavigation
            monthName={nextMonthName}
            year={nextYear}
            handlePrevMonth={handlePrevMonthSecondCalender}
            handleNextMonth={handleNextMonthSecondCalender}
            handlePrevYear={handlePrevYearSecondCalender}
            handleNextYear={handleNextYearSecondCalender}
          />
          <Calendar
            currentDate={nextMonthDate}
            calendarDays={calendarDaysNext}
            selectedRange={selectedRange}
            highlightedDates={highlightedDates}
            handleDateClick={handleDateClick}
            getDaysInMonth={getDaysInMonth}
            getFirstDayOfMonth={getFirstDayOfMonth}
            isWeekend={isWeekend}
            isWeekday={isWeekday}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <PredefinedRanges
          predefinedRanges={PREDEFINED_RANGES}
          applyPredefinedRange={applyPredefinedRange}
        />
        <button onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

export default WeekdayDateRangePicker;
