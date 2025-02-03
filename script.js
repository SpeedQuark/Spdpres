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

        // Mostrar la figura/número/matriz
        if (mode === "matrix") {
            showMatrix(count + 1);
        } else if (mode === "figures") {
            showFigures(size);
        } else {
            showNumbers();
        }

        // Incrementar el contador
        count++;

        // Esperar el tiempo de visualización antes de limpiar y continuar
        timeoutId = setTimeout(() => {
            numbersDiv.innerHTML = ''; // Limpiar el área de visualización

            // Esperar el tiempo entre números antes de mostrar el siguiente
            timeoutId = setTimeout(() => {
                showNextNumber();
            }, delay);
        }, displayTime);
    }

    // Iniciar el proceso
    showNextNumber();
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

function stopGenerator() {
    isRunning = false;
    document.getElementById('start').disabled = false;
    clearTimeout(timeoutId);
    document.getElementById('numbers').innerHTML = '';
}

// Resto del código (showNumbers, showMatrix, generateRandomNumber, etc.)...
