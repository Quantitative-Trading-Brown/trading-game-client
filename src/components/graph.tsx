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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

const Graph = () => {
  const { socket } = useSocket();
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Price",
        data: data,
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
  const updateChart = (label: string, y: number) => {
    setLabels((prevLabels) => [...prevLabels, label]);
    setData((prevData) => [...prevData, y]); // New data
  };

  useEffect(() => {
    if (socket) {
      socket.on("price", (price: number) => {
        var d = new Date();
        var n = d.toLocaleTimeString();
        updateChart(n, price);
      });

      return () => {
        socket.off("price");
      };
    }
  }, [socket]);

  return <Line data={chartData} options={options} />;
};

export default Graph;
