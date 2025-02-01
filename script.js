let interval;
let lastSeries = [];

document.getElementById('start').addEventListener('click', startGenerator);
document.getElementById('stop').addEventListener('click', stopGenerator);
document.getElementById('showLast').addEventListener('click', showLastSeries);

function startGenerator() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const delay = parseInt(document.getElementById('delay').value);
    const displayTime = parseInt(document.getElementById('displayTime').value);
    const size = parseInt(document.getElementById('size').value);
    const pairs = parseInt(document.getElementById('pairs').value);

    const numbersDiv = document.getElementById('numbers');
    numbersDiv.innerHTML = ''; // Comienza en blanco
    lastSeries = [];

    let count = 0;

    function showNextNumber() {
        if (count >= quantity) {
            stopGenerator();
            return;
        }

        // Tiempo en blanco antes de mostrar el número
        setTimeout(() => {
            const randomNumber = Math.floor(Math.random() * 100);
            const formattedNumber = String(randomNumber).padStart(2, '0'); // Formato de 2 dígitos
            lastSeries.push(formattedNumber);

            numbersDiv.innerHTML = formattedNumber;
            numbersDiv.style.fontSize = `${size}px`;

            // Tiempo de visualización del número
            setTimeout(() => {
                numbersDiv.innerHTML = ''; // Vuelve a blanco después de mostrar el número

                // Tiempo en blanco antes del siguiente número
                setTimeout(() => {
                    count++;
                    showNextNumber(); // Repite el ciclo
                }, delay);
            }, displayTime);
        }, delay); // Tiempo en blanco inicial
    }

    showNextNumber(); // Inicia la secuencia
}

function stopGenerator() {
    clearInterval(interval);
    interval = null;
    document.getElementById('numbers').innerHTML = ''; // Limpia la pantalla
}

function showLastSeries() {
    alert(`Última serie: ${lastSeries.join(', ')}`);
}
