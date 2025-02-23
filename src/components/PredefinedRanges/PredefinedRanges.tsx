import React from "react";
import { PredefinedRange } from "../type";

interface PredefinedRangesProps {
  predefinedRanges: PredefinedRange[];
  applyPredefinedRange: (startDate: Date, endDate: Date) => void;
}

const PredefinedRanges: React.FC<PredefinedRangesProps> = ({
  predefinedRanges,
  applyPredefinedRange,
}) => {
  return (
    <div>
      {predefinedRanges.map((range) => (
        <button
          key={range.label}
          onClick={() => applyPredefinedRange(range.startDate, range.endDate)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default PredefinedRanges;
