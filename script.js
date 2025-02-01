 function showNextNumber() {
    if (count >= quantity || !isRunning) {
        stopGenerator();
        return;
    }

    // Tiempo en blanco antes de mostrar el número
    timeoutId = setTimeout(() => {
        if (!isRunning) return; // Detener si se presionó Stop

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

        // Tiempo de visualización del número
        timeoutId = setTimeout(() => {
            numbersDiv.innerHTML = ''; // Vuelve a blanco después de mostrar el número
            count++;
            showNextNumber(); // Repite el ciclo
        }, displayTime);
    }, delay); // Tiempo en blanco inicial
 }
