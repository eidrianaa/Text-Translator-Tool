import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './History.css';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const HistoryPage = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem('languageStats') || '{}');
    const labels = Object.keys(stats);
    const chartData = Object.values(stats);
    const backgroundColors = labels.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
    const borderColors = labels.map(() => '#FFFFFF');

    setData({
      labels,
      datasets: [{
        data: chartData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    });
  }, []);

  return (
    <div className="history-page">
      <h1>Language Translation Statistics</h1>
      <Doughnut data={data} />
    </div>
  );
};

export default HistoryPage;

