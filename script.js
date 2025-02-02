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
    matrixNumberElement.textContent = matrixNumber; // Solo mostramos el número
    matrixNumberElement.style.fontSize = `${size}px`;

    // Crear la cuadrícula
    const matrix = document.createElement('div');
    matrix.className = 'matrix';
    matrix.style.gridTemplateColumns = `repeat(${cols}, ${matrixSize}px)`;
    matrix.style.gridTemplateRows = `repeat(${rows}, ${matrixSize}px)`;

    // Guardar la matriz en la última serie
    const matrixData = [];
    for (let i = 0; i < rows * cols; i++) {
        const cellValue = Math.random() < 0.5 ? '0' : '1'; // 0 = blanco, 1 = azul
        matrixData.push(cellValue);

        const cell = document.createElement('div');
        cell.className = `cell ${cellValue === '1' ? 'blue' : 'white'}`;
        matrix.appendChild(cell);
    }
    lastSeries.push(matrixData.join('')); // Guardar la matriz como cadena de 0s y 1s

    // Limpiar y agregar elementos al contenedor
    numbersDiv.innerHTML = '';
    numbersDiv.appendChild(matrixNumberElement); // Agregar el número de la matriz (arriba)
    numbersDiv.appendChild(matrix); // Agregar la matriz
}
