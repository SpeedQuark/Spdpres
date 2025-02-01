let timeoutId;
let lastSeries = [];
let isRunning = false;

document.getElementById('start').addEventListener('click', startGenerator);
document.getElementById('stop').addEventListener('click', stopGenerator);
document.getElementById('showLast').addEventListener('click', showLastSeries);
document.getElementById('saveProfile').addEventListener('click', saveProfile);
document.getElementById('deleteProfile').addEventListener('click', deleteProfile);
document.getElementById('profileSelect').addEventListener('change', loadProfile);

// Cargar perfiles al iniciar
loadProfiles();

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

                // Tiempo en blanco antes del siguiente número
                timeoutId = setTimeout(() => {
                    count++;
                    showNextNumber(); // Repite el ciclo
                }, delay);
            }, displayTime);
        }, delay); // Tiempo en blanco inicial
    }

    showNextNumber(); // Inicia la secuencia
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
    alert(`Última serie:\n${lastSeries.join('\n')}`);
}

// Funcionalidad de perfiles
function loadProfiles() {
    const profileSelect = document.getElementById('profileSelect');
    profileSelect.innerHTML = '<option value="">Selecciona un perfil</option>';

    for (let i = 0; i < localStorage.length; i++) {
        const profileName = localStorage.key(i);
        const option = document.createElement('option');
        option.value = profileName;
        option.textContent = profileName;
        profileSelect.appendChild(option);
    }
}

function saveProfile() {
    const profileName = prompt("Ingresa un nombre para el perfil:");
    if (!profileName) {
        alert("Debes ingresar un nombre para el perfil.");
        return;
    }

    const profile = {
        mode: document.getElementById('mode').value,
        quantity: document.getElementById('quantity').value,
        delay: document.getElementById('delay').value,
        displayTime: document.getElementById('displayTime').value,
        size: document.getElementById('size').value,
        pairs: document.getElementById('pairs').value,
    };

    localStorage.setItem(profileName, JSON.stringify(profile));
    alert(`Perfil "${profileName}" guardado correctamente.`);
    loadProfiles(); // Actualizar la lista de perfiles
}

function loadProfile() {
    const profileName = document.getElementById('profileSelect').value;
    if (!profileName) return;

    const profile = JSON.parse(localStorage.getItem(profileName));
    if (!profile) {
        alert(`El perfil "${profileName}" no existe.`);
        return;
    }

    document.getElementById('mode').value = profile.mode;
    document.getElementById('quantity').value = profile.quantity;
    document.getElementById('delay').value = profile.delay;
    document.getElementById('displayTime').value = profile.displayTime;
    document.getElementById('size').value = profile.size;
    document.getElementById('pairs').value = profile.pairs;

    alert(`Perfil "${profileName}" cargado correctamente.`);
}

function deleteProfile() {
    const profileName = document.getElementById('profileSelect').value;
    if (!profileName) {
        alert("Selecciona un perfil para eliminar.");
        return;
    }

    if (!localStorage.getItem(profileName)) {
        alert(`El perfil "${profileName}" no existe.`);
        return;
    }

    localStorage.removeItem(profileName);
    alert(`Perfil "${profileName}" eliminado correctamente.`);
    loadProfiles(); // Actualizar la lista de perfiles
}
