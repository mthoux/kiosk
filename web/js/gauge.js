/**
 * @file gauge.js
 * @description Layered-optimized gauge for Raspberry Pi.
 * Separates static background from dynamic animation to save CPU.
 */

const staticCanvas = document.getElementById('gauge-static');
const dynamicCanvas = document.getElementById('gauge-dynamic');
const sCtx = staticCanvas.getContext('2d');
const dCtx = dynamicCanvas.getContext('2d');

let currentPercent = 0;
let animationId = null;
let cachedSize = 0;
let colors = { bg: '#ecf0f1', red: '#db3434' };

const CONFIG = {
    UI: { FONT_FAMILY: 'Arial', COLOR_DARK: '#000000' },
    RATIOS: {
        SAFETY_MARGIN: 0.09,
        GAP: 0.020,
        TICK_MAJOR: 0.04,
        TICK_MINOR: 0.03,
        INNER_RADIUS: 0.025,
        FONT_SIZE: 0.05,
        LABEL_OFFSET: 0.040
    },
    ANIMATION: { EASING: 0.15, PRECISION: 0.1 }
};

/**
 * Update styles and resize both canvas buffers
 */
function syncLayout() {
    const parent = dynamicCanvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    
    if (size === 0) return;
    cachedSize = size;

    // Sync CSS colors
    const rootStyle = getComputedStyle(document.documentElement);
    colors.bg = rootStyle.getPropertyValue('--top-panel-bg').trim() || '#ecf0f1';
    colors.red = rootStyle.getPropertyValue('--gauge-red').trim() || '#db3434';

    // Resize buffers for Retina/HD
    [staticCanvas, dynamicCanvas].forEach(canv => {
        canv.width = size * 2;
        canv.height = size * 2;
        canv.style.width = `${size}px`;
        canv.style.height = `${size}px`;
    });

    drawStaticLayer();
    drawDynamicLayer(currentPercent);
}

/**
 * Draws everything that NEVER moves (Circle, Ticks, Labels)
 */
function drawStaticLayer() {
    const size = cachedSize;
    const cx = size / 2;
    const cy = size / 2;

    sCtx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);
    sCtx.save();
    sCtx.scale(2, 2);

    const safetyMargin = size * CONFIG.RATIOS.SAFETY_MARGIN;
    const gap = size * CONFIG.RATIOS.GAP;
    const majorTickLen = size * CONFIG.RATIOS.TICK_MAJOR;
    const outerR = (size / 2) - safetyMargin - gap - majorTickLen;
    const innerR = size * CONFIG.RATIOS.INNER_RADIUS;

    // 1. Background Circle
    sCtx.fillStyle = colors.bg;
    sCtx.beginPath();
    sCtx.arc(cx, cy, outerR, 0, Math.PI * 2);
    sCtx.fill();

    // 2. Center Hole
    sCtx.fillStyle = CONFIG.UI.COLOR_DARK;
    sCtx.beginPath();
    sCtx.arc(cx, cy, innerR, 0, Math.PI * 2);
    sCtx.fill();

    // 3. Ticks & Labels
    sCtx.strokeStyle = CONFIG.UI.COLOR_DARK;
    sCtx.fillStyle = CONFIG.UI.COLOR_DARK;
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';

    for (let i = 0; i <= 100; i += 5) {
        const angle = (i / 100) * Math.PI * 2 - Math.PI / 2;
        const isMajor = i % 10 === 0;
        const tickLen = isMajor ? majorTickLen : size * CONFIG.RATIOS.TICK_MINOR;
        const rStart = outerR + gap;
        const rEnd = rStart + tickLen;

        sCtx.lineWidth = isMajor ? size * 0.008 : size * 0.004;
        sCtx.beginPath();
        sCtx.moveTo(cx + Math.cos(angle) * rStart, cy + Math.sin(angle) * rStart);
        sCtx.lineTo(cx + Math.cos(angle) * rEnd, cy + Math.sin(angle) * rEnd);
        sCtx.stroke();

        if (isMajor) {
            sCtx.font = `bold ${Math.round(size * CONFIG.RATIOS.FONT_SIZE)}px ${CONFIG.UI.FONT_FAMILY}`;
            const dist = rEnd + (size * CONFIG.RATIOS.LABEL_OFFSET);
            sCtx.fillText(i === 100 ? 0 : i, cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist);
        }
    }
    sCtx.restore();
}

/**
 * Draws only the moving parts (Red Arc)
 */
function drawDynamicLayer(percent) {
    const size = cachedSize;
    const cx = size / 2;
    const cy = size / 2;

    dCtx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);
    dCtx.save();
    dCtx.scale(2, 2);

    const safetyMargin = size * CONFIG.RATIOS.SAFETY_MARGIN;
    const gap = size * CONFIG.RATIOS.GAP;
    const majorTickLen = size * CONFIG.RATIOS.TICK_MAJOR;
    const outerR = (size / 2) - safetyMargin - gap - majorTickLen;
    const innerR = size * CONFIG.RATIOS.INNER_RADIUS;

    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (percent / 100) * Math.PI * 2;

    if (percent > 0) {
        dCtx.beginPath();
        dCtx.arc(cx, cy, outerR, startAngle, endAngle);
        dCtx.arc(cx, cy, innerR, endAngle, startAngle, true);
        dCtx.closePath();
        dCtx.fillStyle = colors.red;
        dCtx.fill();
        dCtx.lineWidth = size * 0.01;
        dCtx.strokeStyle = CONFIG.UI.COLOR_DARK;
        dCtx.stroke();
    }
    dCtx.restore();
}

window.updateGauge = (target) => {
    if (animationId) cancelAnimationFrame(animationId);

    const animate = () => {
        const diff = target - currentPercent;
        if (Math.abs(diff) < CONFIG.ANIMATION.PRECISION) {
            currentPercent = target;
            drawDynamicLayer(currentPercent);
            animationId = null;
            return;
        }
        currentPercent += diff * CONFIG.ANIMATION.EASING;
        drawDynamicLayer(currentPercent);
        animationId = requestAnimationFrame(animate);
    };
    animate();
};

// Redraw all when window is resize. Useless in context of fixed size window
//window.addEventListener('resize', syncLayout);
syncLayout();