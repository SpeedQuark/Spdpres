let timeoutId;
let lastSeries = [];
let isRunning = false;

document.getElementById('start').addEventListener('click', startGenerator);
document.getElementById('stop').addEventListener('click', stopGenerator);
document.getElementById('showLast').addEventListener('click', showLastSeries);
document.getElementById('mode').addEventListener('change', toggleMatrixControls);

function startGenerator() {
    if (isRunning) return;
    isRunning = true;
    document.getElementById('start').disabled = true;

    const quantity = Math.max(1, parseInt(document.getElementById('quantity').value));
    const delay = Math.max(0, parseInt(document.getElementById('delay').value));
    const displayTime = Math.max(0, parseInt(document.getElementById('displayTime').value));
    const size = Math.max(10, parseInt(document.getElementById('size').value));
    const pairs = Math.max(1, parseInt(document.getElementById('pairs').value));
    const mode = document.getElementById('mode').value;

    const numbersDiv = document.getElementById('numbers');
    numbersDiv.innerHTML = '';
    lastSeries = [];

    let count = 0;

    function showNextNumber() {
        if (count >= quantity || !isRunning) {
            stopGenerator();
            return;
        }

        timeoutId = setTimeout(() => {
            if (!isRunning) return;

            if (mode === "matrix") {
                showMatrix(count + 1);
            } else {
                showNumbers();
            }

            timeoutId = setTimeout(() => {
                numbersDiv.innerHTML = '';
                count++;
                showNextNumber();
            }, displayTime);
        }, delay);
    }

    showNextNumber();
}

function generateRandomNumber(mode) {
    if (mode === "decimal") {
        return String(Math.floor(Math.random() * 100)).padStart(2, '0');
    } else if (mode === "binary6") {
        return formatBinary(generateBinary(6), 3);
    } else if (mode === "binary8") {
        return formatBinary(generateBinary(8), 4);
    }
}

function showNumbers() {
    const mode = document.getElementById('mode').value;
    const pairs = parseInt(document.getElementById('pairs').value);
    const size = parseInt(document.getElementById('size').value);
    const numbersDiv = document.getElementById('numbers');

    const randomNumbers = Array.from({ length: pairs }, () => generateRandomNumber(mode));
    lastSeries.push(randomNumbers.join(' • '));

    numbersDiv.innerHTML = randomNumbers
        .map((num) => `<div class="number-pair">${num}</div>`)
        .join('<span class="separator"> • </span>');
    numbersDiv.style.fontSize = `${size}px`;
}

function showMatrix(matrixNumber) {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const matrixSize = parseInt(document.getElementById('matrixSize').value);
    const size = parseInt(document.getElementById('size').value);
    const numbersDiv = document.getElementById('numbers');

    if (rows <= 0 || cols <= 0) {
        alert("El número de filas y columnas debe ser mayor que 0.");
        return;
    }

    // Crear el número de la matriz (arriba)
    const matrixNumberElement = document.createElement('div');
    matrixNumberElement.className = 'matrix-number';
    matrixNumberElement.textContent = matrixNumber;
    matrixNumberElement.style.fontSize = `${size}px`;

    // Crear la cuadrícula
    const matrix = document.createElement('div');
    matrix.className = 'matrix';
    matrix.style.gridTemplateColumns = `repeat(${cols}, ${matrixSize}px)`;
    matrix.style.gridTemplateRows = `repeat(${rows}, ${matrixSize}px)`;

    // Guardar la matriz en la última serie
    const matrixData = [];
    for (let i = 0; i < rows * cols; i++) {
        const cellValue = Math.random() < 0.5 ? '0' : '1';
        matrixData.push(cellValue);

        const cell = document.createElement('div');
        cell.className = `cell ${cellValue === '1' ? 'blue' : 'white'}`;
        matrix.appendChild(cell);
    }
    lastSeries.push(matrixData.join(''));

    // Limpiar y agregar elementos al contenedor
    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(matrixNumberElement); // Número de la matriz (arriba)
    numbersDiv.appendChild(matrix); // Matriz
}

function generateBinary(length) {
    let binary = '';
    for (let i = 0; i < length; i++) {
        binary += Math.round(Math.random());
    }
    return binary;
}

function formatBinary(binary, groupSize) {
    const part1 = binary.slice(0, groupSize);
    const part2 = binary.slice(groupSize);
    return `${part1}<br>${part2}`;
}

function stopGenerator() {
    isRunning = false;
    document.getElementById('start').disabled = false;
    clearTimeout(timeoutId);
    document.getElementById('numbers').innerHTML = '';
}

function showLastSeries() {
    const mode = document.getElementById('mode').value;
    let message = '';

    if (mode === "matrix") {
        message = lastSeries
            .map((series, index) => `Matriz ${index + 1}:\n${series.match(/.{1,2}/g).join(' ')}`)
            .join('\n\n');
    } else {
        message = lastSeries.join('\n');
    }

    alert(`Última serie:\n${message}`);
}

function toggleMatrixControls() {
    const mode = document.getElementById('mode').value;
    const matrixControls = document.querySelectorAll('.matrix-controls');

    matrixControls.forEach((control) => {
        control.style.display = mode === "matrix" ? 'flex' : 'none';
    });
}
