// elements
const numberOfLoopsText = document.getElementById("numberOfLoops"),
    animationSpeedText = document.getElementById("animationSpeed"),
    numberOfArcsText = document.getElementById("numberOfArcs"),
    userNumberOfArcs = document.getElementById("userNumberOfArcs"),
    userAnimationSpeed = document.getElementById("userAnimationSpeed"),
    userNumberOfLoops = document.getElementById("userNumberOfLoops"),
    toggleButton = document.getElementById("toggleAnimation");

const canvas = document.getElementById("surface");
const drawingSurface = canvas.getContext("2d");
let afreq = null;

const resize = () => {
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight * 0.65;
};

window.addEventListener("resize", resize);
resize();

let numberOfLoops;
let animationTime;
let numberOfArcs;
let startTime;
let elapsedTime;
let lineMargin = 0.95;
let halfWidth = canvas.width / 2 - canvas.width * (1 - lineMargin) - 2;
let offset = halfWidth / numberOfArcs;

const updateVars = () => {
    numberOfLoops = parseInt(userNumberOfLoops.value);
    animationTime = parseInt(userAnimationSpeed.value);
    numberOfArcs = parseInt(userNumberOfArcs.value);
    if (numberOfLoops < numberOfArcs) numberOfLoops = numberOfArcs + 1;
    numberOfLoopsText.innerText = numberOfLoops;
    animationSpeedText.innerText = animationTime + "s";
    numberOfArcsText.innerText = numberOfArcs;
    lineMargin = 0.95;
    halfWidth = canvas.width / 2 - canvas.width * (1 - lineMargin) - 2;
    offset = halfWidth / numberOfArcs;
    startTime = Date.now();
    elapsedTime = 0;
};

updateVars();

const circleSize = 7;
const audioFiles = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
].map((_, i) => {
    const audio = new Audio(`assets/${i + 1}.wav`);
    audio.preload = "auto";
    audio.load();
    return audio;
});
const audioPlaying = audioFiles.map((i) => false);

const getPointOnCircle = (centerX, centerY, radius, angle) => {
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
};

const drawDot = (index, radius) => {
    drawingSurface.beginPath();
    let speed =
        ((elapsedTime / 1000) * Math.PI * 2 * (numberOfLoops - index)) /
        animationTime;
    let projectedAngle = speed % (2 * Math.PI);
    if (projectedAngle < 0.1) {
        audioPlaying[index] = true;
        audioFiles[index].play();
        audioPlaying[index] = false;
    }
    if (projectedAngle > Math.PI) {
        if (audioPlaying[index] == true) {
            audioFiles[index].play();
        }
        audioPlaying[index] = false;
        speed *= -1;
    } else {
        audioPlaying[index] = true;
    }
    let angle = Math.PI + speed;

    const { x, y } = getPointOnCircle(
        canvas.width / 2,
        canvas.height * lineMargin,
        radius,
        angle
    );

    drawingSurface.arc(x, y, circleSize, 0, 2 * Math.PI);
    drawingSurface.fillStyle = "#fcfcfc";
    drawingSurface.fill();
};

const drawArcs = () => {
    for (let i = 0; i < numberOfArcs; i++) {
        let r = Math.abs(150 - i * 13),
            g = 122 - ((i * 84) % 255) / 40 + 20,
            b = Math.abs(222 - i * 8),
            centerX = canvas.width / 2,
            bottomY = canvas.height * lineMargin - 2,
            radius = offset + i * offset;

        drawingSurface.beginPath();
        drawingSurface.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        drawingSurface.lineWidth = 4;
        drawingSurface.arc(centerX, bottomY, radius, Math.PI, 2 * Math.PI);
        drawingSurface.stroke();
        drawDot(i, radius);
    }
};

const drawBottomLine = () => {
    // bottom line
    drawingSurface.beginPath();
    drawingSurface.strokeStyle = "#c4c4c4";
    drawingSurface.moveTo(
        canvas.width * (1 - lineMargin),
        canvas.height * lineMargin
    );
    drawingSurface.lineTo(
        canvas.width * lineMargin,
        canvas.height * lineMargin
    );
    drawingSurface.stroke();
};

const draw = () => {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
    elapsedTime = Date.now() - startTime;
    drawBottomLine();
    drawArcs();
    afreq = window.requestAnimationFrame(draw);
};

draw();

const toggleAnimation = () => {
    if (afreq) {
        window.cancelAnimationFrame(afreq);
        afreq = null;
    } else {
        window.requestAnimationFrame(draw);
    }
};

// event liseners.

userNumberOfArcs.addEventListener("change", updateVars);
userNumberOfLoops.addEventListener("change", updateVars);
userAnimationSpeed.addEventListener("change", updateVars);
toggleButton.addEventListener("click", toggleAnimation);
