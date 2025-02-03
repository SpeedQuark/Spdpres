let timeoutId;
let lastSeries = [];
let isRunning = false;

// Lista de números correspondientes a las imágenes en la carpeta "figuras"
const existingFigures = ['00', '01', '02', '03', '04', '05']; // Ejemplo: Solo estas imágenes existen

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
                showFigures(size); // Pasar el tamaño como parámetro
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

function showFigures(size) {
    const numbersDiv = document.getElementById('numbers');

    // Seleccionar un número aleatorio de la lista de figuras existentes
    const randomNumber = existingFigures[Math.floor(Math.random() * existingFigures.length)];

    // Crear la imagen
    const imgElement = document.createElement('img');
    imgElement.src = `figuras/${randomNumber}.png`; // Ruta de la imagen
    imgElement.alt = `Figura ${randomNumber}`;
    imgElement.style.width = `${size}px`; // Tamaño de la imagen

    // Guardar la figura en la última serie
    lastSeries.push(randomNumber);

    // Mostrar la figura
    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(imgElement);
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
    matrixNumberElement.style
