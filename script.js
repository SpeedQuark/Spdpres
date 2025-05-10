let timeoutId;
let lastSeries = [];
let isRunning = false;

// Figuras válidas (00-09 y 30-99)
const validFigures = Array.from({length: 70}, (_, i) => 
    i < 10 ? String(i).padStart(2, '0') : String(i + 20).padStart(2, '0'));

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start').addEventListener('click', startGenerator);
    document.getElementById('stop').addEventListener('click', stopGenerator);
    document.getElementById('showLast').addEventListener('click', showLastSeries);
    document.getElementById('mode').addEventListener('change', toggleMatrixControls);
});

function startGenerator() {
    if (isRunning) return;
    
    if (!validateInputs()) {
        alert("Por favor corrige los valores ingresados");
        return;
    }
    
    isRunning = true;
    document.getElementById('start').disabled = true;

    const config = {
        quantity: parseInt(document.getElementById('quantity').value),
        delay: parseInt(document.getElementById('delay').value),
        displayTime: parseInt(document.getElementById('displayTime').value),
        size: parseInt(document.getElementById('size').value),
        pairs: parseInt(document.getElementById('pairs').value),
        mode: document.getElementById('mode').value,
        rows: parseInt(document.getElementById('rows')?.value || 2),
        cols: parseInt(document.getElementById('cols')?.value || 2),
        matrixSize: parseInt(document.getElementById('matrixSize')?.value || 50)
    };

    const numbersDiv = document.getElementById('numbers');
    numbersDiv.innerHTML = '';
    lastSeries = [];

    let count = 0;

    function generate() {
        if (count >= config.quantity || !isRunning) {
            stopGenerator();
            return;
        }

        numbersDiv.innerHTML = '';
        
        switch(config.mode) {
            case "matrix":
                showMatrix(count + 1, config);
                break;
            case "figures":
                showFigures(config);
                break;
            default:
                showNumbers(config);
        }

        count++;

        timeoutId = setTimeout(() => {
            numbersDiv.innerHTML = '';
            timeoutId = setTimeout(generate, config.delay);
        }, config.displayTime);
    }

    generate();
}

function showFigures({ pairs, size }) {
    const numbersDiv = document.getElementById('numbers');
    const shuffled = [...validFigures].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, pairs);

    selected.forEach(num => {
        const img = document.createElement('img');
        img.src = `figuras/${num}.png`;
        img.style.width = `${size}px`;
        img.alt = `Figura ${num}`;
        img.onerror = () => img.style.display = 'none'; // Oculta si no carga
        numbersDiv.appendChild(img);
    });

    lastSeries.push(selected.join(' • '));
}

function showNumbers({ pairs, size, mode }) {
    const numbersDiv = document.getElementById('numbers');
    const randomNumbers = Array.from({length: pairs}, () => generateRandomNumber(mode));
    
    lastSeries.push(randomNumbers.join(' • '));
    numbersDiv.innerHTML = randomNumbers.map(num => 
        `<span style="font-size:${size}px">${num}</span>`
    ).join(' • ');
}

function showMatrix(matrixNumber, { rows, cols, matrixSize, size }) {
    const numbersDiv = document.getElementById('numbers');
    
    // Número de matriz
    const numberElement = document.createElement('div');
    numberElement.textContent = matrixNumber;
    numberElement.style.fontSize = `${size}px`;
    numberElement.style.marginBottom = '10px';
    
    // Crear matriz
    const matrix = document.createElement('div');
    matrix.style.display = 'grid';
    matrix.style.gridTemplateColumns = `repeat(${cols}, ${matrixSize}px)`;
    matrix.style.gridTemplateRows = `repeat(${rows}, ${matrixSize}px)`;
    matrix.style.gap = '1px';
    matrix.style.backgroundColor = '#888';
    
    // Celdas
    const matrixData = [];
    for (let i = 0; i < rows * cols; i++) {
        const cellValue = Math.random() < 0.5 ? '0' : '1';
        matrixData.push(cellValue);
        
        const cell = document.createElement('div');
        cell.style.display = 'flex';
        cell.style.justifyContent = 'center';
        cell.style.alignItems = 'center';
        cell.style.backgroundColor = cellValue === '1' ? '#0056b3' : 'white';
        matrix.appendChild(cell);
    }
    
    lastSeries.push({ data: matrixData.join(''), cols });
    numbersDiv.appendChild(numberElement);
    numbersDiv.appendChild(matrix);
}

function generateRandomNumber(mode) {
    if (mode === "decimal") {
        return String(Math.floor(Math.random() * 100)).padStart(2, '0');
    } else if (mode === "binary6") {
        const binary = Array.from({length: 6}, () => Math.round(Math.random())).join('');
        return `${binary.slice(0, 3)}<br>${binary.slice(3)}`;
    } else if (mode === "binary8") {
        const binary = Array.from({length: 8}, () => Math.round(Math.random())).join('');
        return `${binary.slice(0, 4)}<br>${binary.slice(4)}`;
    }
}

function stopGenerator() {
    isRunning = false;
    clearTimeout(timeoutId);
    document.getElementById('start').disabled = false;
}

function showLastSeries() {
    const mode = document.getElementById('mode').value;
    let message = '';
    
    if (mode === "matrix") {
        message = lastSeries.map((series, i) => {
            const formatted = series.data.match(new RegExp(`.{1,${series.cols}}`, 'g')).join('\n');
            return `Matriz ${i+1}:\n${formatted}`;
        }).join('\n\n');
    } else {
        message = lastSeries.join('\n');
    }
    
    alert("Última serie:\n" + message);
}

function toggleMatrixControls() {
    const mode = document.getElementById('mode').value;
    document.querySelectorAll('.matrix-controls').forEach(el => {
        el.style.display = mode === "matrix" ? 'flex' : 'none';
    });
}

function validateInputs() {
    const inputs = [
        { id: 'quantity', min: 1, message: "La cantidad debe ser al menos 1" },
        { id: 'delay', min: 0, message: "El tiempo entre números no puede ser negativo" },
        { id: 'displayTime', min: 0, message: "El tiempo de visualización no puede ser negativo" },
        { id: 'size', min: 10, message: "El tamaño mínimo es 10px" },
        { id: 'pairs', min: 1, message: "Debe haber al menos 1 par" }
    ];

    for (const {id, min, message} of inputs) {
        const value = parseInt(document.getElementById(id).value);
        if (isNaN(value) || value < min) {
            alert(message);
            return false;
        }
    }
    
    if (document.getElementById('mode').value === "matrix") {
        const matrixInputs = [
            { id: 'rows', min: 1, message: "Las filas deben ser al menos 1" },
            { id: 'cols', min: 1, message: "Las columnas deben ser al menos 1" },
            { id: 'matrixSize', min: 10, message: "El tamaño de celda mínimo es 10px" }
        ];
        
        for (const {id, min, message} of matrixInputs) {
            const value = parseInt(document.getElementById(id).value);
            if (isNaN(value) || value < min) {
                alert(message);
                return false;
            }
        }
    }
    
    return true;
}
