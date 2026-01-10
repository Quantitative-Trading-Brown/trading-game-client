"use client";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartOptions,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSocket } from "@/contexts/SocketContext";
import { SecurityProps } from "@/utils/Types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

type GraphProps = {
  selectedSecurity: string;
};

type PriceVals = {
  [key: string]: number[];
};

type TimeVals = {
  [key: string]: string[];
};

const GraphCell: React.FC<GraphProps> = ({ selectedSecurity }) => {
  const { socket } = useSocket();
  const [securityData, setSecurityData] = useState<PriceVals>({ test: [5] });
  const [timeLabels, setTimeLabels] = useState<TimeVals>({ test: ["a"] });
  const [viewMode, setViewMode] = useState<"single" | "stacked">("single");

  const createChartData = (securityId: number | string) => ({
    labels: timeLabels[securityId] || [],
    datasets: [
      {
        label: `Security ${securityId}`,
        data: securityData[securityId] || [],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0
      }
    ]
  });

  const options: ChartOptions<'line'> = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        intersect: false
      }
    },
    scales: {
      x: {
        display: false,
        ticks: {
          color: "white"
        }
      },
      y: {
        ticks: {
          color: "white"
        }
      }
    }
  };

  const updateChart = (security: string, label: string, y: number) => {
    setTimeLabels((prevLabels) => {
      const updatedLabels = [...(prevLabels[security] || []), label];
      return {
        ...prevLabels,
        [security]: updatedLabels.slice(-30)
      };
    });
    setSecurityData((prevData) => {
      const updatedData = [...(prevData[security] || []), y];
      return {
        ...prevData,
        [security]: updatedData.slice(-30)
      };
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on("prices", (prices: { [key: string]: number }) => {
        var d = new Date();
        var n = d.toLocaleTimeString();
        for (const sec_id in prices) {
          updateChart(sec_id, n, prices[sec_id]);
        }
      });
      return () => {
        socket.off("prices");
      };
    }
  }, [socket]);

  const allSecurityIds = Object.keys(securityData).filter(
    (id) => id !== "test"
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-5">
        <h2 className="text-xl font-bold">Graphs</h2>
        <button
          onClick={() =>
            setViewMode(viewMode === "single" ? "stacked" : "single")
          }
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
        >
          {viewMode === "single" ? "Show All Stacked" : "Show Single"}
        </button>
      </div>

      {viewMode === "single" ? (
        <div className="flex-grow flex flex-col h-0 p-2">
          <div className="h-full">
            <div className="h-full">
              <Line
                data={createChartData(selectedSecurity)}
                options={options}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow h-0 overflow-y-auto">
          {allSecurityIds.map((secId) => (
            <div key={secId} className="border border-gray-600 p-2">
              <h3 className="text-white text-sm mb-1">Security {secId}</h3>
              <div className="">
                <Line data={createChartData(secId)} options={options} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GraphCell;
