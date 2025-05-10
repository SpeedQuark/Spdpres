let timeoutId;
let lastSeries = [];
let isRunning = false;

document.getElementById('start').addEventListener('click', startGenerator);
document.getElementById('stop').addEventListener('click', stopGenerator);
document.getElementById('showLast').addEventListener('click', showLastSeries);
document.getElementById('mode').addEventListener('change', toggleMatrixControls);

function startGenerator() {
    if (isRunning) return;
    if (!validateInputs()) return;
    
    isRunning = true;
    document.getElementById('start').disabled = true;

    const quantity = parseInt(document.getElementById('quantity').value);
    const delay = parseInt(document.getElementById('delay').value);
    const displayTime = parseInt(document.getElementById('displayTime').value);
    const size = parseInt(document.getElementById('size').value);
    const pairs = parseInt(document.getElementById('pairs').value);
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

        if (mode === "matrix") {
            showMatrix(count + 1);
        } else if (mode === "figures") {
            showFigures();
        } else {
            showNumbers();
        }

        count++;

        timeoutId = setTimeout(() => {
            numbersDiv.innerHTML = '';
            timeoutId = setTimeout(showNextNumber, delay);
        }, displayTime);
    }

    showNextNumber();
}

function showNumbers() {
    const mode = document.getElementById('mode').value;
    const pairs = parseInt(document.getElementById('pairs').value);
    const size = parseInt(document.getElementById('size').value);
    const numbersDiv = document.getElementById('numbers');

    const randomNumbers = Array.from({ length: pairs }, () => generateRandomNumber(mode));
    lastSeries.push(randomNumbers.join(' • '));

    numbersDiv.innerHTML = randomNumbers
        .map(num => `<span class="number-pair" style="font-size:${size}px">${num}</span>`)
        .join(' • ');
}

function showFigures() {
    const pairs = parseInt(document.getElementById('pairs').value);
    const size = parseInt(document.getElementById('size').value);
    const numbersDiv = document.getElementById('numbers');

    const randomFigures = [];
    for (let i = 0; i < pairs; i++) {
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 100);
        } while (randomNumber >= 10 && randomNumber <= 29);
        randomNumber = String(randomNumber).padStart(2, '0');
        randomFigures.push(randomNumber);
    }

    lastSeries.push(randomFigures.join(' • '));

    numbersDiv.innerHTML = randomFigures
        .map(num => `<img src="figuras/${num}.png" alt="Figura ${num}" style="width:${size}px">`)
        .join(' • ');
}

function showMatrix(matrixNumber) {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const matrixSize = parseInt(document.getElementById('matrixSize').value);
    const size = parseInt(document.getElementById('size').value);
    const numbersDiv = document.getElementById('numbers');

    const matrixNumberElement = document.createElement('div');
    matrixNumberElement.className = 'matrix-number';
    matrixNumberElement.textContent = matrixNumber;
    matrixNumberElement.style.fontSize = `${size}px`;

    const matrix = document.createElement('div');
    matrix.className = 'matrix';
    matrix.style.gridTemplateColumns = `repeat(${cols}, ${matrixSize}px)`;
    matrix.style.gridTemplateRows = `repeat(${rows}, ${matrixSize}px)`;

    const matrixData = [];
    for (let i = 0; i < rows * cols; i++) {
        const cellValue = Math.random() < 0.5 ? '0' : '1';
        matrixData.push(cellValue);

        const cell = document.createElement('div');
        cell.className = `cell ${cellValue === '1' ? 'blue' : 'white'}`;
        matrix.appendChild(cell);
    }
    lastSeries.push({ data: matrixData.join(''), cols });

    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(matrixNumberElement);
    numbersDiv.appendChild(matrix);
}

function generateRandomNumber(mode) {
    if (mode === "decimal") {
        return String(Math.floor(Math.random() * 100)).padStart(2, '0');
    } else if (mode === "binary6") {
        const binary = Array.from({ length: 6 }, () => Math.round(Math.random())).join('');
        return `${binary.slice(0, 3)}<br>${binary.slice(3)}`;
    } else if (mode === "binary8") {
        const binary = Array.from({ length: 8 }, () => Math.round(Math.random())).join('');
        return `${binary.slice(0, 4)}<br>${binary.slice(4)}`;
    }
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
            .map((series, index) => {
                const { data, cols } = series;
                const formattedData = data.match(new RegExp(`.{1,${cols}}`, 'g')).join('\n');
                return `Matriz ${index + 1}:\n${formattedData}`;
            })
            .join('\n\n');
    } else {
        message = lastSeries.join('\n');
    }

    alert(`Última serie:\n${message}`);
}

function toggleMatrixControls() {
    const mode = document.getElementById('mode').value;
    const matrixControls = document.querySelectorAll('.matrix-controls');
    matrixControls.forEach(control => {
        control.style.display = mode === "matrix" ? 'flex' : 'none';
    });
}

function validateInputs() {
    const inputs = [
        { id: 'quantity', min: 1, message: "La cantidad debe ser > 0" },
        { id: 'delay', min: 0, message: "Tiempo entre números no puede ser negativo" },
        { id: 'displayTime', min: 0, message: "Tiempo de visualización no puede ser negativo" },
        { id: 'size', min: 10, message: "Tamaño mínimo es 10px" },
        { id: 'pairs', min: 1, message: "Debe haber al menos 1 par" }
    ];

    for (const { id, min, message } of inputs) {
        const value = parseInt(document.getElementById(id).value);
        if (isNaN(value) || value < min) {
            alert(message);
            return false;
        }
    }
    return true;
}
