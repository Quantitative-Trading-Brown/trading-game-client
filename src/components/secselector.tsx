"use client";
import { useState, useEffect } from "react";

import { Security, SecurityProps } from "@/utils/Types";

type SelectorBoxProps = {
  securities: SecurityProps;
  onChange: (value: string) => void;
};

const SelectorCell: React.FC<SelectorBoxProps> = ({ securities, onChange }) => {
  const keys = Object.keys(securities);
  const [selectedSecurity, setSelectedSecurity] = useState(keys[0]);

  const select = (key: string) => {
    setSelectedSecurity(key);
    onChange(key);
  };

  const ChangeSecurity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    select(e.target.value);
  };

  useEffect(() => {
    const isInputFocused = () => {
      const tag = document.activeElement?.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    };

    const handleKey = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      if (e.key !== "[" && e.key !== "]") return;

      const idx = keys.indexOf(selectedSecurity);
      if (e.key === "[") {
        const next = (idx - 1 + keys.length) % keys.length;
        select(keys[next]);
      } else {
        const next = (idx + 1) % keys.length;
        select(keys[next]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedSecurity, keys]);

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">Select Security</h2>
        <span className="text-xs text-gray-500">[ / ] to cycle</span>
      </div>
      <div className="flex gap-10 justify-center items-center flex-wrap px-8 py-5">
        <select
          id="security-select"
          value={selectedSecurity}
          onChange={ChangeSecurity}
          className="px-4 py-2 bg-gray-700 flex-grow"
        >
          {Object.entries(securities).map(
            ([key, value]: [string, Security]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
};

export default SelectorCell;
