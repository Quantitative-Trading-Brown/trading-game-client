"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";

import { Security, SecurityProps } from "@/utils/Types";

type SelectorBoxProps = {
  securities: SecurityProps;
  onChange: (value: string) => void;
};

const SelectorCell: React.FC<SelectorBoxProps> = ({ securities, onChange }) => {
  const [rankings, setRankings] = useState([]);
  const [selectedSecurity, setSelectedSecurity] = useState(
    Object.keys(securities)[0]
  );

  const { socket } = useSocket();

  const ChangeSecurity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSecurity(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <h2 className="font-bold text-xl">Select Security</h2>
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
