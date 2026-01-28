import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#94a3b8'
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: '#334155'
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    y: {
      grid: {
        color: '#334155'
      },
      ticks: {
        color: '#94a3b8'
      }
    }
  }
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#94a3b8'
      }
    }
  }
};

export const LineChart = ({ data, title }) => (
  <div className="w-full h-64">
    {title && <h3 className="text-slate-400 mb-2 font-medium">{title}</h3>}
    <Line options={defaultOptions} data={data} />
  </div>
);

export const BarChart = ({ data, title }) => (
  <div className="w-full h-64">
    {title && <h3 className="text-slate-400 mb-2 font-medium">{title}</h3>}
    <Bar options={defaultOptions} data={data} />
  </div>
);

export const PieChart = ({ data, title }) => (
  <div className="w-full h-64">
    {title && <h3 className="text-slate-400 mb-2 font-medium">{title}</h3>}
    <Pie options={pieOptions} data={data} />
  </div>
);

export const DoughnutChart = ({ data, title }) => (
  <div className="w-full h-64">
    {title && <h3 className="text-slate-400 mb-2 font-medium">{title}</h3>}
    <Doughnut options={pieOptions} data={data} />
  </div>
);