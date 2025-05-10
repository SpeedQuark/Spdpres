let timeoutId;
let lastSeries = [];
let isRunning = false;

// Lista de figuras válidas (00-09 y 30-99)
const validFigures = [];
for (let i = 0; i < 100; i++) {
    if (i < 10 || i > 29) validFigures.push(String(i).padStart(2, '0'));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start').addEventListener('click', startGenerator);
    document.getElementById('stop').addEventListener('click', stopGenerator);
    document.getElementById('showLast').addEventListener('click', showLastSeries);
    document.getElementById('mode').addEventListener('change', toggleMatrixControls);
});

function startGenerator() {
    if (isRunning) return;
    if (!validateInputs()) return;
    
    isRunning = true;
    document.getElementById('start').disabled = true;

    const config = {
        quantity: parseInt(document.getElementById('quantity').value),
        delay: parseInt(document.getElementById('delay').value),
        displayTime: parseInt(document.getElementById('displayTime').value),
        size: parseInt(document.getElementById('size').value),
        pairs: parseInt(document.getElementById('pairs').value),
        mode: document.getElementById('mode').value,
        rows: parseInt(document.getElementById('rows')?.value || 0),
        cols: parseInt(document.getElementById('cols')?.value || 0),
        matrixSize: parseInt(document.getElementById('matrixSize')?.value || 0)
    };

    const numbersDiv = document.getElementById('numbers');
    numbersDiv.innerHTML = '';
    lastSeries = [];

    let count = 0;

    function generate() {
        if (count >= config.quantity || !isRunning) {
            stopGenerator();
            return;
        }

        switch(config.mode) {
            case "matrix":
                showMatrix(count + 1, config);
                break;
            case "figures":
                showFigures(config);
                break;
            default:
                showNumbers(config);
        }

        count++;

        timeoutId = setTimeout(() => {
            numbersDiv.innerHTML = '';
            timeoutId = setTimeout(generate, config.delay);
        }, config.displayTime);
    }

    generate();
}

function showFigures({ pairs, size }) {
    const numbersDiv = document.getElementById('numbers');
    const figures = [];
    
    // Seleccionar figuras aleatorias válidas
    const shuffled = [...validFigures].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, pairs);

    selected.forEach(num => {
        figures.push(`<img src="figuras/${num}.png" alt="Figura ${num}" style="width:${size}px">`);
    });

    lastSeries.push(selected.join(' • '));
    numbersDiv.innerHTML = figures.join(' • ');
}

// ... (Mantén las otras funciones showNumbers, showMatrix, generateRandomNumber, etc. igual que en tu versión original)

// Función para verificar existencia de imágenes (opcional)
function imageExists(url) {
    const img = new Image();
    img.src = url;
    return img.height > 0;
}

function stopGenerator() {
    isRunning = false;
    document.getElementById('start').disabled = false;
    clearTimeout(timeoutId);
}

function showLastSeries() {
    alert("Última serie:\n" + lastSeries.join('\n'));
}

function toggleMatrixControls() {
    const mode = document.getElementById('mode').value;
    document.querySelectorAll('.matrix-controls').forEach(el => {
        el.style.display = mode === "matrix" ? 'flex' : 'none';
    });
}

function validateInputs() {
    const inputs = [
        { id: 'quantity', min: 1, msg: "La cantidad debe ser ≥ 1" },
        { id: 'delay', min: 0, msg: "El tiempo entre números debe ser ≥ 0" },
        { id: 'displayTime', min: 0, msg: "El tiempo de visualización debe ser ≥ 0" },
        { id: 'size', min: 10, msg: "El tamaño mínimo es 10px" },
        { id: 'pairs', min: 1, msg: "Debe haber al menos 1 par" }
    ];

    for (const {id, min, msg} of inputs) {
        const val = parseInt(document.getElementById(id).value);
        if (isNaN(val) || val < min) {
            alert(msg);
            return false;
        }
    }
    return true;
}
