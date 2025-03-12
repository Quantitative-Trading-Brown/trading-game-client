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
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSocket } from "@/contexts/SocketContext";
import { SecurityProps } from "@/utils/Types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

type GraphProps = {
  selected: number;
  securities: SecurityProps;
};

type PriceVals = {
  [key: number]: number[];
};
type TimeVals = {
  [key: number]: string[];
};

const Graph = (props: GraphProps) => {
  const { socket } = useSocket();
  const [securityData, setSecurityData] = useState<PriceVals>({});
  const [timeLabels, setTimeLabels] = useState<TimeVals>({});

  const chartData = {
    labels: timeLabels[props.selected],
    datasets: [
      {
        label: "Price",
        data: securityData[props.selected],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Makes the line smooth
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to use parent height
    plugins: {
      tooltip: {
        // mode: "nearest",
        intersect: false,
      },
    },
    scales: {
      x: {
        display: false,
        ticks: {
          color: "white", // Set text color for X-axis labels
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };
  const updateChart = (security: number, label: string, y: number) => {
    setTimeLabels((prevLabels) => {
      const updatedLabels = [...(prevLabels[security] || []), label];

      // Trim to keep only the last 30 elements
      return {
        ...prevLabels,
        [security]: updatedLabels.slice(-30),
      };
    });

    setSecurityData((prevData) => {
      const updatedData = [...(prevData[security] || []), y*props.securities[security].scale];

      // Trim to keep only the last 30 elements
      return {
        ...prevData,
        [security]: updatedData.slice(-30),
      };
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on("price", (security: number, price: number) => {
        var d = new Date();
        var n = d.toLocaleTimeString();
        updateChart(security, n, price);
      });

      return () => {
        socket.off("price");
      };
    }
  }, [socket]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow h-0">
        <Line data={chartData} options={options} className="h-full" />
      </div>
    </div>
  );
};

export default Graph;
