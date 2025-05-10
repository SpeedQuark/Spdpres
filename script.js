let timeoutId;
let isRunning = false;

document.getElementById('start').addEventListener('click', function() {
    if (isRunning) return;
    
    isRunning = true;
    const quantity = parseInt(document.getElementById('quantity').value);
    const delay = parseInt(document.getElementById('delay').value);
    const size = parseInt(document.getElementById('size').value);
    const mode = document.getElementById('mode').value;
    
    const numbersDiv = document.getElementById('numbers');
    numbersDiv.innerHTML = '';
    
    let count = 0;
    
    function showNext() {
        if (count >= quantity || !isRunning) {
            stopGenerator();
            return;
        }
        
        numbersDiv.innerHTML = '';
        
        if (mode === 'figures') {
            // Generar número entre 00-09 o 30-99
            let num;
            do {
                num = Math.floor(Math.random() * 100);
            } while (num >= 10 && num <= 29);
            
            num = String(num).padStart(2, '0');
            const img = document.createElement('img');
            img.src = 'figuras/' + num + '.png';
            img.style.width = size + 'px';
            img.alt = 'Figura ' + num;
            numbersDiv.appendChild(img);
        } else {
            // Modo decimal
            const num = String(Math.floor(Math.random() * 100)).padStart(2, '0');
            const span = document.createElement('span');
            span.textContent = num;
            span.style.fontSize = size + 'px';
            numbersDiv.appendChild(span);
        }
        
        count++;
        
        timeoutId = setTimeout(function() {
            numbersDiv.innerHTML = '';
            timeoutId = setTimeout(showNext, delay);
        }, 1000);
    }
    
    showNext();
});

document.getElementById('stop').addEventListener('click', stopGenerator);

function stopGenerator() {
    isRunning = false;
    clearTimeout(timeoutId);
    document.getElementById('numbers').innerHTML = '';
}
