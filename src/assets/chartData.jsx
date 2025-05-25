

export const optionsLine = {
    scales: {
        x: {
            ticks: { color: 'rgba(255, 255, 255, 1)' }
        },
        y: {
            ticks: { color: 'rgba(255, 255, 255, 1)' }
        }
    },
    plugins: {
        legend: {
            labels: { color: 'rgba(255, 255, 255, 1)' }
        },
        tooltip: {
            bodyColor: 'rgba(255, 255, 255, 1)',
            titleColor: 'rgba(255, 255, 255, 1)'
        }
    }
};

export const dataBar = {
    labels: ['2024', '2025', '2026'],
    datasets: [
        {
            label: 'Số lượt',
            data: [22, 50, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
        }
    ]
};



export const optionsBar = {
    scales: {
        x: {
            ticks: {
                color: 'rgba(255, 255, 255, 1)'
            }
        },
        y: {
            ticks: {
                color: 'rgba(255, 255, 255, 1)'
            }
        }
    },
    plugins: {
        legend: {
            labels: {
                color: 'rgba(255, 255, 255, 1)'
            }
        },
        tooltip: {
            bodyColor: 'rgba(255, 255, 255, 1)',
            titleColor: 'rgba(255, 255, 255, 1)'
        }
    }
};
