import React, { useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarGraph = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const labels = ['Jun 3', 'Jun 6', 'Jun 8', 'Jun 10', 'Jun 12', 'Jun 15'];

  const allDatasets = {
    grossRevenue: {
      label: 'Gross Revenue',
      data: [10, 20, 15, 25, 18, 30],
      backgroundColor: '#007bff',
    },
    grossUnits: {
      label: 'Gross Units Sold',
      data: [12, 18, 10, 22, 16, 28],
      backgroundColor: '#003366',
    },
    returnUnits: {
      label: 'Return Units',
      data: [2, 3, 1, 4, 2, 5],
      backgroundColor: '#ffc107',
    },
  };

  const getVisibleDatasets = () => {
    switch (activeFilter) {
      case 'grossRevenue':
        return [{ ...allDatasets.grossRevenue, barThickness: 18, borderRadius: 5 }];
      case 'grossUnits':
        return [{ ...allDatasets.grossUnits, barThickness: 18, borderRadius: 5 }];
      case 'returnUnits':
        return [{ ...allDatasets.returnUnits, barThickness: 18, borderRadius: 5 }];
      default:
        return Object.values(allDatasets).map(ds => ({
          ...ds,
          barThickness: 18,
          borderRadius: 5,
        }));
    }
  };

  const data = {
    labels,
    datasets: getVisibleDatasets(),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#333', boxWidth: 15 } },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6c757d' } },
      y: {
        beginAtZero: true,
        ticks: { color: '#6c757d' },
        grid: { color: '#e9ecef', drawBorder: false },
      },
    },
  };

  return (
    <div className="bg-white  rounded" style={{ maxWidth: '800px', width: '100%' }}>
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <button
          className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button
          className={`btn btn-sm ${activeFilter === 'grossRevenue' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveFilter('grossRevenue')}
        >
          Gross Revenue
        </button>
        <button
          className={`btn btn-sm ${activeFilter === 'grossUnits' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setActiveFilter('grossUnits')}
        >
          Gross Units Sold
        </button>
        <button
          className={`btn btn-sm ${activeFilter === 'returnUnits' ? 'btn-primary' : 'btn-outline-warning'}`}
          onClick={() => setActiveFilter('returnUnits')}
        >
          Return Units
        </button>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;
