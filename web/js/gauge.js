const ctx = document.getElementById('monGraphique').getContext('2d');
const PI2 = Math.PI * 2;

const gaugePlugins = {
    id: 'gaugeCustom',

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

    afterDraw: (chart) => {
        const { ctx, chartArea: { left, right, top, bottom } } = chart;
        const centerX = (left + right) / 2, centerY = (top + bottom) / 2;
        const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 16px Arial';

        for (let i = 0; i <= 100; i += 5) {
            const isMajor = i % 10 === 0;
            const angle = (i / 100) * PI2 - Math.PI / 2;
            const length = isMajor ? 15 : 8;
            const cos = Math.cos(angle), sin = Math.sin(angle);

            // Traits
            ctx.lineWidth = isMajor ? 3 : 1;
            ctx.beginPath();
            ctx.moveTo(centerX + cos * outerRadius, centerY + sin * outerRadius);
            ctx.lineTo(centerX + cos * (outerRadius + length), centerY + sin * (outerRadius + length));
            ctx.stroke();

            // Chiffres
            if (isMajor) {
                const dist = outerRadius + length + 20;
                ctx.fillText(i === 100 ? 0 : i, centerX + cos * dist, centerY + sin * dist);
            }
        }
        ctx.restore();
    }
};

const monCamembert = new Chart(ctx, {
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
    plugins: [gaugePlugins]
});

const setChartTo = (pct) => {
    const val = Math.max(0, Math.min(pct, 100));
    monCamembert.data.datasets[0].data = [val, 100 - val];
    monCamembert.update();
};