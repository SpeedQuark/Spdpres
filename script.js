let timeoutId;
let lastSeries = [];
let isRunning = false;

document.getElementById('start').addEventListener('click', startGenerator);
document.getElementById('stop').addEventListener('click', stopGenerator);
document.getElementById('showLast').addEventListener('click', showLastSeries);
document.getElementById('exportLast').addEventListener('click', exportLastSeries);
document.getElementById('mode').addEventListener('change', toggleMatrixControls);

function startGenerator() {
    if (isRunning) return;
    if (!validateInputs()) return;
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
                showFigures(size);
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

function showNumbers() {
    const mode = document.getElementById('mode').value;
    const pairs = parseInt(document.getElementById('pairs').value);
    const size = parseInt(document.getElementById('size').value);
    const numbersDiv = document.getElementById('numbers');

    const randomNumbers = Array.from({ length: pairs }, () => generateRandomNumber(mode));
    lastSeries.push(randomNumbers.join(' '));

    numbersDiv.innerHTML = randomNumbers
        .map((num) => `<span class="number-pair">${num}</span>`)
        .join(' ');
    numbersDiv.style.fontSize = `${size}px`;
    numbersDiv.style.display = 'flex';
    numbersDiv.style.gap = '10px';
}

function showFigures(size) {
    const numbersDiv = document.getElementById('numbers');

    // Generar un número aleatorio entre 0 y 99, omitiendo del 10 al 29
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 100);
    } while (randomNumber >= 10 && randomNumber <= 29); // Omitir del 10 al 29

    randomNumber = String(randomNumber).padStart(2, '0'); // Formatear a 2 dígitos

    // Crear la imagen
    const imgElement = document.createElement('img');
    imgElement.src = `figuras/${randomNumber}.png`;
    imgElement.alt = `Figura ${randomNumber}`;
    imgElement.style.width = `${size}px`;

    // Guardar la figura en la última serie
    lastSeries.push(randomNumber);

    // Mostrar la figura
    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(imgElement);
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
    lastSeries.push({ data: matrixData.join(''), cols });

    // Limpiar y agregar elementos al contenedor
    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(matrixNumberElement);
    numbersDiv.appendChild(matrix);
}

function generateRandomNumber(mode) {
    if (mode === "decimal") {
        return String(Math.floor(Math.random() * 100)).padStart(2, '0');
    } else if (mode === "binary6") {
        return formatBinary(generateBinary(6), 3); // Mantener saltos de línea
    } else if (mode === "binary8") {
        return formatBinary(generateBinary(8), 4); // Mantener saltos de línea
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
    return `${part1}<br>${part2}`; // Mantener el salto de línea
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
                const formattedData = data
                    .match(new RegExp(`.{1,${cols}}`, 'g'))
                    .join('\n');
                return `Matriz ${index + 1}:\n${formattedData}`;
            })
            .join('\n\n');
    } else if (mode === "figures") {
        message = lastSeries.join('\n');
    } else {
        message = lastSeries.join('\n');
    }

    alert(`Última serie:\n${message}`);
}

function exportLastSeries() {
    if (lastSeries.length === 0) {
        alert("No hay ninguna serie generada para exportar.");
        return;
    }

    const mode = document.getElementById('mode').value;
    let content = '';

    if (mode === "matrix") {
        content = lastSeries
            .map((series, index) => {
                const { data, cols } = series;
                const formattedData = data
                    .match(new RegExp(`.{1,${cols}}`, 'g'))
                    .join('\n');
                return `Matriz ${index + 1}:\n${formattedData}`;
            })
            .join('\n\n');
    } else {
        content = lastSeries.join('\n');
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serie_${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function toggleMatrixControls() {
    const mode = document.getElementById('mode').value;
    const matrixControls = document.querySelectorAll('.matrix-controls');

    matrixControls.forEach((control) => {
        control.style.display = mode === "matrix" ? 'flex' : 'none';
    });
}

function validateInputs() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const delay = parseInt(document.getElementById('delay').value);
    const displayTime = parseInt(document.getElementById('displayTime').value);
    const size = parseInt(document.getElementById('size').value);
    const pairs = parseInt(document.getElementById('pairs').value);

    if (isNaN(quantity) || quantity <= 0) {
        alert("La cantidad de números debe ser mayor que 0.");
        return false;
    }
    if (isNaN(delay) || delay < 0) {
        alert("El tiempo entre números no puede ser negativo.");
        return false;
    }
    if (isNaN(displayTime) || displayTime < 0) {
        alert("El tiempo de visualización no puede ser negativo.");
        return false;
    }
    if (isNaN(size) || size < 10) {
        alert("El tamaño de los números debe ser al menos 10px.");
        return false;
    }
    if (isNaN(pairs) || pairs <= 0) {
        alert("El número de pares simultáneos debe ser mayor que 0.");
        return false;
    }
    return true;
}
