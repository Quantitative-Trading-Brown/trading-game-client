"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const Graph = (props : {security : string}) => {
  const data = {
    labels: ['-25 sec', '-20 sec', '-15 sec', '-10 sec', '-5 sec', 'Now'],
    datasets: [
      {
        label: 'Price',
        data: [90, 70, 150, 120, 135, 110],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
        mode: "nearest",
        intersect: false,
      }
    },
    scales: {
      x: {
        display:false,
        ticks: {
          color: 'white', // Set text color for X-axis labels
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default Graph;
