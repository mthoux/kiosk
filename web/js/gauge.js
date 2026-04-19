/**
 * @file gauge.js
 * @description Configures and manages the Doughnut chart using Chart.js.
 */

const ctx = document.getElementById('monGraphique').getContext('2d');
const PI2 = Math.PI * 2;

/**
 * Custom plugin to draw the gauge background and scale markings
 */
const gaugeCustomPlugin = {
    id: 'gaugeCustom',

    // Draws the black center circle
    beforeDraw: (chart) => {
        const { ctx, chartArea: { left, right, top, bottom } } = chart;
        const meta = chart.getDatasetMeta(0).data[0];
        if (!meta) return;

        ctx.save();
        ctx.translate((left + right) / 2, (top + bottom) / 2);
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(0, 0, meta.innerRadius, 0, PI2);
        ctx.fill();
        ctx.restore();
    },

    // Draws the ticks and percentage labels around the chart
    afterDraw: (chart) => {
        const { ctx, chartArea: { left, right, top, bottom } } = chart;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 16px Arial';

        for (let i = 0; i <= 100; i += 5) {
            const isMajor = i % 10 === 0;
            const angle = (i / 100) * PI2 - Math.PI / 2;
            const length = isMajor ? 15 : 8;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            // Draw scale ticks
            ctx.lineWidth = isMajor ? 3 : 1;
            ctx.beginPath();
            ctx.moveTo(centerX + cos * outerRadius, centerY + sin * outerRadius);
            ctx.lineTo(centerX + cos * (outerRadius + length), centerY + sin * (outerRadius + length));
            ctx.stroke();

            // Draw numeric labels
            if (isMajor) {
                const labelDistance = outerRadius + length + 20;
                ctx.fillText(i === 100 ? 0 : i, centerX + cos * labelDistance, centerY + sin * labelDistance);
            }
        }
        ctx.restore();
    }
};

/**
 * Global Chart instance
 */
const mainChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [0, 100],
            backgroundColor: ['#db3434', 'transparent'],
            borderColor: ['#000000', 'transparent'],
            borderWidth: 4,
            cutout: '5%'
        }]
    },
    options: {
        responsive: true,
        layout: { padding: 50 },
        plugins: { tooltip: false, legend: false },
        events: []
    },
    plugins: [gaugeCustomPlugin]
});

/**
 * Updates the chart completion percentage
 * @param {number} pct - Percentage value (0 to 100)
 */
window.updateGauge = (pct) => {
    const value = Math.max(0, Math.min(pct, 100));
    mainChart.data.datasets[0].data = [value, 100 - value];
    mainChart.update();
};