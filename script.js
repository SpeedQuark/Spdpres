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
            } else if (mode === "figures") {
                showFigures();
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

function showFigures() {
    const numbersDiv = document.getElementById('numbers');
    const figures = ['circle', 'square', 'triangle'];
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

    // Seleccionar una figura y un color aleatorio
    const randomFigure = figures[Math.floor(Math.random() * figures.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Crear la figura
    const figureElement = document.createElement('div');
    figureElement.className = `figure ${randomFigure} ${randomColor}`;

    // Guardar la figura en la última serie
    lastSeries.push(`${randomFigure} ${randomColor}`);

    // Mostrar la figura
    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(figureElement);
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
    matrixNumberElement.style.textAlign = 'center'; // Centrar el número

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
    lastSeries.push({ data: matrixData.join(''), cols }); // Guardar la matriz y el número de columnas

    // Limpiar y agregar elementos al contenedor
    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(matrixNumberElement); // Agregar el número de la matriz (arriba)
    numbersDiv.appendChild(matrix); // Agregar la matriz
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
        // Mostrar matrices en 0s y 1s con espacios según las columnas
        message = lastSeries
            .map((series, index) => {
                const { data, cols } = series;
                const formattedData = data
                    .match(new RegExp(`.{1,${cols}}`, 'g')) // Dividir en grupos según las columnas
                    .join('\n'); // Unir con saltos de línea
                return `Matriz ${index + 1}:\n${formattedData}`;
            })
            .join('\n\n');
    } else if (mode === "figures") {
        // Mostrar la última serie de figuras
        message = lastSeries.join('\n');
    } else {
        // Mostrar números decimales o binarios
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
