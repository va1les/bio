let timerInterval;
let timerActive = false;
let editableElement = null;

function startPauseTimer() {
    if (!timerActive) {
        saveTime(); // Сохраняем время перед запуском таймера

        const hours = parseInt(document.getElementById('hours').textContent);
        const minutes = parseInt(document.getElementById('minutes').textContent);
        const seconds = parseInt(document.getElementById('seconds').textContent);

        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            alert("Некорректный формат времени. Пожалуйста, используйте числа.");
            return;
        }

        let totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (totalSeconds <= 0) {
            alert("Время должно быть больше 00:00:00.");
            return;
        }

        timerInterval = setInterval(() => {
            totalSeconds--;
            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                timerActive = false;
                playSelectedSound(); // Воспроизвести звуковой сигнал по окончанию времени
            }
            updateTimerDisplay(totalSeconds);
        }, 1000);

        timerActive = true;
        togglePlayButton(); // Делаем кнопку воспроизведения неактивной
    } else {
        clearInterval(timerInterval);
        timerActive = false;
        togglePlayButton(); // Включаем кнопку воспроизведения
        updateTitle(0);
        window.location.href = "https://va1les.ru/timer";
    }
}

function togglePlayButton() {
    const playBtn = document.querySelector('.play-btn');
    if (timerActive) {
        playBtn.classList.add('paused'); // Добавляем класс для изменения иконки на кнопке
    } else {
        playBtn.classList.remove('paused'); // Удаляем класс, чтобы вернуть исходную иконку
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerActive = false;
    updateTimerDisplay(0);
}

function editTime(e) {
    if (!timerActive) {
        const display = e.target.closest('.timer-part');
        if (display && !editableElement) {
            editableElement = display;
            display.contentEditable = true;
            display.focus();
            document.execCommand('selectAll', false, null);
        } else if (editableElement && display !== editableElement) {
            editableElement.contentEditable = false;
            saveTime();
            editableElement = null;
        }
    }
}

document.getElementById('hours').addEventListener('click', editTime);
document.getElementById('minutes').addEventListener('click', editTime);
document.getElementById('seconds').addEventListener('click', editTime);

document.getElementById('hours').addEventListener('keypress', function (e) {
    if (!timerActive && e.key === 'Enter') {
        saveTime();
    }
});

document.getElementById('minutes').addEventListener('keypress', function (e) {
    if (!timerActive && e.key === 'Enter') {
        saveTime();
    }
});

document.getElementById('seconds').addEventListener('keypress', function (e) {
    if (!timerActive && e.key === 'Enter') {
        saveTime();
    }
});

document.getElementById('hours').addEventListener('blur', function () {
    if (!timerActive) {
        saveTime();
    }
});

document.getElementById('minutes').addEventListener('blur', function () {
    if (!timerActive) {
        saveTime();
    }
});

document.getElementById('seconds').addEventListener('blur', function () {
    if (!timerActive) {
        saveTime();
    }
});

function updateTitle(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    if (timerActive) {
        document.title = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
        document.title = "Таймер не запущен";
    }
}

function updateTimerDisplay(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    hoursDisplay.textContent = formattedHours;
    minutesDisplay.textContent = formattedMinutes;
    secondsDisplay.textContent = formattedSeconds;
    updateTitle(totalSeconds);
}

function saveTime() {
    const hours = parseInt(document.getElementById('hours').textContent);
    const minutes = parseInt(document.getElementById('minutes').textContent);
    const seconds = parseInt(document.getElementById('seconds').textContent);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        alert("Некорректный формат времени. Пожалуйста, используйте числа.");
        return;
    }

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    updateTimerDisplay(totalSeconds);

    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');

    hoursDisplay.textContent = formattedHours;
    minutesDisplay.textContent = formattedMinutes;
    secondsDisplay.textContent = formattedSeconds;

    editableElement = null;
}

// Создаем ссылку на аудио-элемент
let sound = null;

function playSelectedSound() {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle.checked) {
        const selectedSound = document.getElementById('soundSelect').value;
        if (sound) {
            sound.pause();
        }
        sound = new Audio(`./assets/audio/timer/${selectedSound}.mp3`);
        sound.play();
    }
}

function stopSelectedSound() {
    if (sound) {
        sound.pause();
        sound.currentTime = 0;
    }
}

let isPlaying = false;

function togglePlay() {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle.checked) {
        isPlaying = !isPlaying;
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');

        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline-block';
            playSelectedSound();
        } else {
            playIcon.style.display = 'inline-block';
            pauseIcon.style.display = 'none';
            stopSelectedSound();
        }
    }
}

function toggleSoundSetting() {
    const soundToggle = document.getElementById('soundToggle');
    const soundSelect = document.getElementById('soundSelect');
    const playBtn = document.querySelector('.play-btn');

    if (soundToggle.checked) {
        soundSelect.disabled = false;
        playBtn.disabled = false;
    } else {
        soundSelect.disabled = true;
        playBtn.disabled = true;
        stopSelectedSound(); // Останавливаем звук, если переключатель выключен
    }
}

function toggleSettings() {
    var settingsContainer = document.getElementById("settingsContainer");
    settingsContainer.classList.toggle("settings-visible");
}

const soundSelect = document.getElementById('soundSelect');

// Список звуковых файлов (можете добавить или удалить файлы по вашему выбору)
const soundFiles = [
    'classic',
    'bell',
    'birds',
    'alert',
    'cricket',
    'digital',
    'flute',
    'guitar',
    'horn',
    'invasion',
    'magic',
    'piano',
    'radar',
    'robot',
    'rooster',
    'school',
];

// Создайте элементы option для каждого звукового файла и добавьте их в select
soundFiles.forEach(file => {
    const option = document.createElement('option');
    option.value = file;
    option.textContent = file;
    soundSelect.appendChild(option);
});
