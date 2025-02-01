let interval;
let lastSeries = [];

document.getElementById('start').addEventListener('click', startGenerator);
document.getElementById('stop').addEventListener('click', stopGenerator);
document.getElementById('showLast').addEventListener('click', showLastSeries);

function startGenerator() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const delay = parseInt(document.getElementById('delay').value);
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
        lastSeries.push(randomNumber);

        numbersDiv.innerHTML = randomNumber;
        numbersDiv.style.fontSize = `${size}px`;

        count++;
    }, delay);
}

function stopGenerator() {
    clearInterval(interval);
}

function showLastSeries() {
    alert(`Última serie: ${lastSeries.join(', ')}`);
}
