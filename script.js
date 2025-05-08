let timeoutId;
let lastSeries = [];
let isRunning = false;

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

    const showNextItem = () => {
        if (count >= config.quantity || !isRunning) {
            stopGenerator();
            return;
        }

        // Mostrar contenido según el modo
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

        // Temporizador para limpiar y mostrar siguiente
        timeoutId = setTimeout(() => {
            numbersDiv.innerHTML = '';
            timeoutId = setTimeout(showNextItem, config.delay);
        }, config.displayTime);
    };

    showNextItem();
}

function showNumbers({ pairs, size, mode }) {
    const numbersDiv = document.getElementById('numbers');
    const randomNumbers = Array.from({ length: pairs }, () => generateRandomNumber(mode));
    
    lastSeries.push(randomNumbers.join(' • '));
    numbersDiv.innerHTML = randomNumbers.map(num => 
        `<span class="number-pair" style="font-size:${size}px">${num}</span>`
    ).join(' • ');
}

function showFigures({ pairs, size }) {
    const numbersDiv = document.getElementById('numbers');
    const randomFigures = [];

    for (let i = 0; i < pairs; i++) {
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 100);
        } while (randomNumber >= 10 && randomNumber <= 29);
        randomFigures.push(String(randomNumber).padStart(2, '0'));
    }

    lastSeries.push(randomFigures.join(' • '));
    numbersDiv.innerHTML = randomFigures.map(num => 
        `<img src="figuras/${num}.png" alt="Figura ${num}" style="width:${size}px">`
    ).join(' • ');
}

function showMatrix(matrixNumber, { rows, cols, matrixSize, size }) {
    const numbersDiv = document.getElementById('numbers');

    // Número de matriz
    const numberElement = document.createElement('div');
    numberElement.className = 'matrix-number';
    numberElement.textContent = matrixNumber;
    numberElement.style.fontSize = `${size}px`;

    // Crear matriz
    const matrix = document.createElement('div');
    matrix.className = 'matrix';
    matrix.style.gridTemplateColumns = `repeat(${cols}, ${matrixSize}px)`;
    matrix.style.gridTemplateRows = `repeat(${rows}, ${matrixSize}px)`;

    // Celdas
    const matrixData = [];
    for (let i = 0; i < rows * cols; i++) {
        const cellValue = Math.random() < 0.5 ? '0' : '1';
        matrixData.push(cellValue);

        const cell = document.createElement('div');
        cell.className = `cell ${cellValue === '1' ? 'blue' : 'white'}`;
        matrix.appendChild(cell);
    }

    // Guardar y mostrar
    lastSeries.push({ data: matrixData.join(''), cols });
    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(numberElement);
    numbersDiv.appendChild(matrix);
}

function generateRandomNumber(mode) {
    switch(mode) {
        case "decimal":
            return String(Math.floor(Math.random() * 100)).padStart(2, '0');
        case "binary6":
            return formatBinary(generateBinary(6), 3);
        case "binary8":
            return formatBinary(generateBinary(8), 4);
        default:
            return "00";
    }
}

function generateBinary(length) {
    return Array.from({ length }, () => Math.round(Math.random())).join('');
}

function formatBinary(binary, groupSize) {
    return `${binary.slice(0, groupSize)}<br>${binary.slice(groupSize)}`;
}

function stopGenerator() {
    isRunning = false;
    clearTimeout(timeoutId);
    document.getElementById('start').disabled = false;
}

function showLastSeries() {
    const mode = document.getElementById('mode').value;
    const historyDiv = document.getElementById('history');
    
    if (mode === "matrix") {
        historyDiv.innerHTML = lastSeries.map((series, i) => `
            <div class="history-item">
                <strong>Matriz ${i + 1}:</strong><br>
                ${series.data.match(new RegExp(`.{1,${series.cols}}`, 'g')).join('<br>')}
            </div>
        `).join('<hr>');
    } else {
        historyDiv.innerHTML = lastSeries.map((series, i) => `
            <div class="history-item"><strong>Serie ${i + 1}:</strong> ${series}</div>
        `).join('');
    }
}

function toggleMatrixControls() {
    const mode = document.getElementById('mode').value;
    const matrixControls = document.querySelectorAll('.matrix-controls');
    matrixControls.forEach(control => {
        control.style.display = mode === "matrix" ? 'flex' : 'none';
    });
}

function validateInputs() {
    const requiredInputs = [
        { id: 'quantity', min: 1, message: "Cantidad debe ser > 0" },
        { id: 'delay', min: 0, message: "Tiempo entre números no puede ser negativo" },
        { id: 'displayTime', min: 0, message: "Tiempo de visualización no puede ser negativo" },
        { id: 'size', min: 10, message: "Tamaño mínimo es 10px" },
        { id: 'pairs', min: 1, message: "Debe haber al menos 1 par" }
    ];

    for (const { id, min, message } of requiredInputs) {
        const value = parseInt(document.getElementById(id).value);
        if (isNaN(value) || value < min) {
            alert(message);
            return false;
        }
    }
    return true;
}
