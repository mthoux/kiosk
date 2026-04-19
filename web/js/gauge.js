/**
 * @file gauge.js
 * @description Manages the SVG gauge scale generation and dynamic value updates.
 */

const gaugeFill = document.getElementById('gaugeFill');
const ticksContainer = document.getElementById('ticks');

/**
 * Draws the circular scale of the gauge, including tick marks and labels.
 * Uses a DocumentFragment to optimize DOM performance by minimizing reflows.
 */
function drawScale() {
    // A virtual container to hold all SVG elements before injecting them into the DOM
    const fragment = document.createDocumentFragment();
    const rBase = 75; // The starting radius for the tick marks

    for (let i = 0; i <= 100; i += 5) {
        const isMajor = i % 10 === 0;
        // Map 0-100 value to degrees (rotated -90deg to start at the top)
        const angle = (i / 100) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const length = isMajor ? 12 : 6;
        
        // Calculate start (x1, y1) and end (x2, y2) coordinates using trigonometry
        const x1 = 100 + Math.cos(rad) * rBase;
        const y1 = 100 + Math.sin(rad) * rBase;
        const x2 = 100 + Math.cos(rad) * (rBase + length);
        const y2 = 100 + Math.sin(rad) * (rBase + length);

        // Create the SVG line element with the correct Namespace
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", isMajor ? 3 : 1);
        fragment.appendChild(line);

        // Add text labels for major tick marks
        if (isMajor) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const xText = 100 + Math.cos(rad) * (rBase + length + 15);
            const yText = 100 + Math.sin(rad) * (rBase + length + 15);
            
            text.setAttribute("x", xText);
            text.setAttribute("y", yText);
            text.setAttribute("fill", "black");
            text.setAttribute("font-size", "14");
            text.setAttribute("font-weight", "bold");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("alignment-baseline", "middle");
            
            // Displays '0' instead of '100' for a continuous look if needed
            text.textContent = i === 100 ? 0 : i;
            fragment.appendChild(text);
        }
    }
    // Final injection of all elements into the SVG container
    ticksContainer.appendChild(fragment);
}

// Initial rendering of the scale
drawScale();

/**
 * Updates the visual fill of the gauge.
 * @param {number} pct - The percentage value (0 to 100).
 */
window.updateGauge = (pct) => {
    // Clamping the value between 0 and 100 to avoid visual glitches
    const value = Math.max(0, Math.min(pct, 100));
    
    // Updates the CSS Custom Property to trigger a smooth hardware-accelerated transition
    gaugeFill.style.setProperty('--pct', `${value}%`);
};