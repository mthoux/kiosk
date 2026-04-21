const progressCircle = document.getElementById('gauge-progress');
const ticksContainer = document.getElementById('ticks');

const radius = 40; 
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = `0 ${circumference}`;

function drawScale() {
    const fragment = document.createDocumentFragment();
    const rBase = 90;
    const centerX = 125;
    const centerY = 125;

    for (let i = 0; i <= 100; i += 5) {
        const isMajor = i % 10 === 0;
        const angle = (i / 100) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const length = isMajor ? 12 : 6;
        
        const x1 = centerX + Math.cos(rad) * rBase;
        const y1 = centerY + Math.sin(rad) * rBase;
        const x2 = centerX + Math.cos(rad) * (rBase + length);
        const y2 = centerY + Math.sin(rad) * (rBase + length);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1); line.setAttribute("y1", y1);
        line.setAttribute("x2", x2); line.setAttribute("y2", y2);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", isMajor ? 2 : 1);
        fragment.appendChild(line);

        if (isMajor) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const xText = centerX + Math.cos(rad) * (rBase + length + 15);
            const yText = centerY + Math.sin(rad) * (rBase + length + 15);
            text.setAttribute("x", xText); text.setAttribute("y", yText);
            text.setAttribute("fill", "black");
            text.setAttribute("font-size", "14");
            text.setAttribute("font-weight", "bold");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("alignment-baseline", "middle");
            text.textContent = i === 100 ? 0 : i;
            fragment.appendChild(text);
        }
    }
    ticksContainer.appendChild(fragment);
}

drawScale();

window.updateGauge = (pct) => {
    const value = Math.max(0, Math.min(pct, 100));
    const offset = (value / 100) * circumference;
    progressCircle.style.strokeDasharray = `${offset} ${circumference}`;
};

updateGauge(29);    