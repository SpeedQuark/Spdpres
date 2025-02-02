let timeoutId;
let lastSeries = [];
let isRunning = false;

document.getElementById('start').addEventListener('click', startGenerator);
document.getElementById('stop').addEventListener('click', stopGenerator);
document.getElementById('showLast').addEventListener('click', showLastSeries);
document.getElementById('mode').addEventListener('change', toggleMatrixControls);

function startGenerator() {
    if (isRunning) return; // Evita múltiples ejecuciones
    isRunning = true;

    const quantity = parseInt(document.getElementById('quantity').value);
    const delay = parseInt(document.getElementById('delay').value);
    const displayTime = parseInt(document.getElementById('displayTime').value);
    const size = parseInt(document.getElementById('size').value);
    const pairs = parseInt(document.getElementById('pairs').value);
    const mode = document.getElementById('mode').value;

    const numbersDiv = document.getElementById('numbers');
    numbersDiv.innerHTML = ''; // Comienza en blanco
    lastSeries = [];

    let count = 0;

    function showNextNumber() {
        if (count >= quantity || !isRunning) {
            stopGenerator();
            return;
        }

        // Tiempo en blanco antes de mostrar el número
        timeoutId = setTimeout(() => {
            if (!isRunning) return; // Detener si se presionó Stop

            if (mode === "matrix") {
                showMatrix(count + 1, quantity); // Pasa el número de la matriz actual y la cantidad total
            } else {
                showNumbers();
            }

            // Tiempo de visualización del número/matriz
            timeoutId = setTimeout(() => {
                numbersDiv.innerHTML = ''; // Vuelve a blanco después de mostrar
                count++;
                showNextNumber(); // Repite el ciclo
            }, displayTime);
        }, delay); // Tiempo en blanco antes de cada número/matriz
    }

    showNextNumber(); // Inicia la secuencia
}

function showNumbers() {
    const mode = document.getElementById('mode').value;
    const pairs = parseInt(document.getElementById('pairs').value);
    const size = parseInt(document.getElementById('size').value);
    const numbersDiv = document.getElementById('numbers');

    const randomNumbers = [];
    for (let i = 0; i < pairs; i++) {
        let randomNumber;
        if (mode === "decimal") {
            randomNumber = Math.floor(Math.random() * 100);
            randomNumber = String(randomNumber).padStart(2, '0'); // Formato de 2 dígitos
        } else if (mode === "binary6") {
            randomNumber = formatBinary(generateBinary(6), 3); // Binario de 6 cifras, formato 3x2
        } else if (mode === "binary8") {
            randomNumber = formatBinary(generateBinary(8), 4); // Binario de 8 cifras, formato 4x2
        }
        randomNumbers.push(randomNumber);
    }
    lastSeries.push(randomNumbers.join(' • ')); // Guardar la serie

    // Mostrar números simultáneos uno al lado del otro
    numbersDiv.innerHTML = randomNumbers
        .map((num) => `<div class="number-pair">${num}</div>`) // Cada número en un div
        .join('<span class="separator"> • </span>'); // Separador con punto medio
    numbersDiv.style.fontSize = `${size}px`;
}

function showMatrix(matrixNumber, totalMatrices) {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const matrixSize = parseInt(document.getElementById('matrixSize').value);
    const size = parseInt(document.getElementById('size').value);
    const numbersDiv = document.getElementById('numbers');

    // Crear el número de la matriz
    const matrixNumberElement = document.createElement('div');
    matrixNumberElement.className = 'matrix-number';
    matrixNumberElement.textContent = matrixNumber;
    matrixNumberElement.style.fontSize = `${size}px`;

    // Crear el número de posición
    const matrixPositionElement = document.createElement('div');
    matrixPositionElement.className = 'matrix-position';
    matrixPositionElement.textContent = `${matrixNumber}/${totalMatrices}`;

    // Crear la cuadrícula
    const matrix = document.createElement('div');
    matrix.className = 'matrix';
    matrix.style.gridTemplateColumns = `repeat(${cols}, ${matrixSize}px)`;
    matrix.style.gridTemplateRows = `repeat(${rows}, ${matrixSize}px)`;

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = `cell ${Math.random() < 0.5 ? 'white' : 'blue'}`; // Aleatorio: blanco o azul
        matrix.appendChild(cell);
    }

    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(matrixNumberElement); // Agregar el número de la matriz
    numbersDiv.appendChild(matrixPositionElement); // Agregar el número de posición
    numbersDiv.appendChild(matrix); // Agregar la matriz
}

function generateBinary(length) {
    let binary = '';
    for (let i = 0; i < length; i++) {
        binary += Math.round(Math.random()); // Genera 0 o 1
    }
    return binary;
}

function formatBinary(binary, groupSize) {
    // Divide el binario en dos partes
    const part1 = binary.slice(0, groupSize); // Primera parte (arriba)
    const part2 = binary.slice(groupSize); // Segunda parte (abajo)
    return `${part1}<br>${part2}`; // Une las partes con un salto de línea
}

function stopGenerator() {
    isRunning = false;
    clearTimeout(timeoutId); // Detiene todos los timeouts
    document.getElementById('numbers').innerHTML = ''; // Limpia la pantalla
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

    if (mode === "matrix") {
        matrixControls.forEach((control) => (control.style.display = 'flex'));
    } else {
        matrixControls.forEach((control) => (control.style.display = 'none'));
    }
}
