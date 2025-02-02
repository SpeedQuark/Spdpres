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
                showMatrix(count + 1); // Solo pasamos el número de la matriz
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

    // Crear el número de la matriz
    const matrixNumberElement = document.createElement('div');
    matrixNumberElement.className = 'matrix-number';
    matrixNumberElement.textContent = matrixNumber; // Solo mostramos el número
    matrixNumberElement.style.fontSize = `${size}px`;

    // Crear la cuadrícula
    const matrix = document.createElement('div');
    matrix.className = 'matrix';
    matrix.style.gridTemplateColumns = `repeat(${cols}, ${matrixSize}px)`;
    matrix.style.gridTemplateRows = `repeat(${rows}, ${matrixSize}px)`;

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = `cell ${Math.random() < 0.5 ? 'white' : 'blue'}`;
        matrix.appendChild(cell);
    }

    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(matrixNumberElement); // Agregar el número de la matriz
    numbersDiv.appendChild(matrix); // Agregar la matriz
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
    const binarySeries = lastSeries.map((series) =>
        series
            .split(' • ')
            .map((num) =>
                num
                    .replace(/<br>/g, '') // Eliminar saltos de línea
                    .split('')
                    .map((char) => (char === '1' ? '1' : '0')) // Azul = 1, Blanco = 0
                    .join('')
            )
            .join(' • ')
    );

    alert(`Última serie en binarios:\n${binarySeries.join('\n')}`);
}

function toggleMatrixControls() {
    const mode = document.getElementById('mode').value;
    const matrixControls = document.querySelectorAll('.matrix-controls');

    matrixControls.forEach((control) => {
        control.style.display = mode === "matrix" ? 'flex' : 'none';
    });
}
