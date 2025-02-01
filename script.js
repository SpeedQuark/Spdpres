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
    numbersDiv.innerHTML = '';
    lastSeries = [];

    let count = 0;
    interval = setInterval(() => {
        if (count >= quantity) {
            stopGenerator();
            return;
        }

        const randomNumber = Math.floor(Math.random() * 100);
        const formattedNumber = String(randomNumber).padStart(2, '0'); // Formato de 2 dígitos
        lastSeries.push(formattedNumber);

        numbersDiv.innerHTML = formattedNumber;
        numbersDiv.style.fontSize = `${size}px`;

        // Limpiar el número después del tiempo de visualización
        setTimeout(() => {
            if (count + 1 < quantity || interval === null) {
                numbersDiv.innerHTML = '';
            }
        }, displayTime);

        count++;
    }, delay);
}

function stopGenerator() {
    clearInterval(interval);
    interval = null;
    document.getElementById('numbers').innerHTML = '';
}

function showLastSeries() {
    alert(`Última serie: ${lastSeries.join(', ')}`);
}
