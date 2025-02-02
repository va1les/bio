const audioFileInput = document.getElementById('audioFileInput');
const playButton = document.getElementById('playButton');
const resetButton = document.getElementById('resetButton');
const downloadButton = document.getElementById('downloadButton');
const speedSlider = document.getElementById('speedSlider');
const currentPositionDisplay = document.getElementById('currentPositionDisplay');
const selectedFileName = document.getElementById('selectedFileName');
const visualizerContainer = document.getElementById('visualizer');
const bassBoostCheckbox = document.getElementById('bassBoostCheckbox');

const stylePlay = document.getElementById("stylePlay");
const stylePause = document.getElementById("stylePause");

const mobileBar = 60;
const isMobile = window.innerWidth <= 768;

let audioContext = new window.AudioContext();
let audioBufferSource = null;
let analyser = audioContext.createAnalyser();
let gainNode = audioContext.createGain();
let isPlaying = false;

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function changeIconPlayButton(boolean, reset_button) {
    if (boolean) {
        stylePlay.style.display = 'none';
        stylePause.style.display = 'block';
        playButton.disabled = false;
        if (reset_button) resetButton.disabled = false;
    } else {
        stylePlay.style.display = 'block';
        stylePause.style.display = 'none';
        playButton.disabled = false;
        if (reset_button) resetButton.disabled = false;
    }
}

async function play() {
    playButton.disabled = true;
    if (audioBufferSource && audioContext.state === 'running') {
        audioContext.suspend().then(() => {
            changeIconPlayButton(false)
        });
    } else if (audioBufferSource && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            changeIconPlayButton(true)
        });
    } else {
        const file = audioFileInput.files[0];
        if (file) {
            playButton.disabled = true;

            const reader = new FileReader();
            reader.onload = async (e) => {
                if (audioBufferSource) {
                    audioBufferSource.stop();
                }

                const buffer = await audioContext.decodeAudioData(e.target.result);
                let processedBuffer = buffer;

                if (bassBoostCheckbox.checked) {
                    processedBuffer = await applyBassBoost(buffer);
                }

                audioBufferSource = audioContext.createBufferSource();
                audioBufferSource.buffer = processedBuffer;
                audioBufferSource.connect(gainNode);
                gainNode.connect(analyser);
                analyser.connect(audioContext.destination);
                audioBufferSource.playbackRate.value = speedSlider.value;
                await audioBufferSource.start(0);
                changeIconPlayButton(true)
                isPlaying = true;

                const originalDuration = processedBuffer.duration;
                const newDuration = originalDuration / speedSlider.value;
                currentPositionDisplay.textContent = `Текущая позиция: ${speedSlider.value}x (${newDuration.toFixed(2)} сек.)`;
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert("Пожалуйста, выберите аудиофайл для загрузки.");
            changeIconPlayButton(false)
            playButton.disabled = true;
        }
    };
};

function reset() {
    resetButton.disabled = true;
    playButton.disabled = true;
    if (audioBufferSource) {
        audioBufferSource.stop();
        audioBufferSource.disconnect();
        audioBufferSource = null;

        const file = audioFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const buffer = await audioContext.decodeAudioData(e.target.result);
                let processedBuffer = buffer;

                if (bassBoostCheckbox.checked) {
                    processedBuffer = await applyBassBoost(buffer);
                }

                audioBufferSource = audioContext.createBufferSource();
                audioBufferSource.buffer = processedBuffer;
                audioBufferSource.connect(gainNode);
                gainNode.connect(analyser);
                analyser.connect(audioContext.destination);
                audioBufferSource.playbackRate.value = speedSlider.value;
                audioBufferSource.start(0);
                changeIconPlayButton(true, true)
                isPlaying = true;
            };
            reader.readAsArrayBuffer(file);
        }
    }
};

async function download() {
    if (audioBufferSource) {
        const playbackRate = parseFloat(speedSlider.value);
        const newBuffer = await applyPlaybackRate(audioBufferSource.buffer, playbackRate);

        const wavData = audioBufferToWav(newBuffer);

        const newBlob = new Blob([wavData], { type: 'audio/wav' });

        const blobUrl = URL.createObjectURL(newBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = 'changed_track.wav';
        downloadLink.click();
        URL.revokeObjectURL(blobUrl);
    } else {
        alert("Пожалуйста, выберите аудиофайл для загрузки.")
    }
}

audioFileInput.addEventListener('change', async () => {
    if (audioBufferSource && isPlaying) {
        audioBufferSource.stop();
        audioBufferSource.disconnect();
        audioBufferSource = null;
        changeIconPlayButton(false);
        isPlaying = false;
    }

    const file = audioFileInput.files[0];
    if (file && file.type.startsWith('audio/')) {
        const mutag = window.mutag;
        if (file.name.endsWith(".mp3")) {
            mutag.fetch(file).then((tags) => {
                selectedFileName.textContent = `${tags.TPE1 === undefined ? tags.TIT2 === undefined ? file.name : tags.TIT2 : `${tags.TPE1} — ${tags.TIT2}`}`;
            });
        } else {
            if (file.name.length > 48) {
                file.name = file.name.substring(0, 45) + '...';
            }
            selectedFileName.textContent = file.name;
        }

        playButton.disabled = false;
        resetButton.disabled = false;
        downloadButton.disabled = false;
    } else if (file && !file.type.startsWith('audio/')) {
        alert("Пожалуйста, выберите аудиофайл для загрузки.");
        audioFileInput.value = null;
        selectedFileName.textContent = "Выберите аудиофайл";
        playButton.disabled = true;
        resetButton.disabled = true;
        downloadButton.disabled = true;
    }
});

speedSlider.addEventListener('input', () => {
    const speedValue = parseFloat(speedSlider.value);
    currentPositionDisplay.textContent = `Текущая позиция: ${speedValue}x`;
    if (audioBufferSource) {
        audioBufferSource.playbackRate.value = speedValue;
    }
});

async function applyPlaybackRate(buffer, rate) {
    const offlineContext = new OfflineAudioContext(buffer.numberOfChannels, buffer.duration * buffer.sampleRate, buffer.sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    source.connect(offlineContext.destination);
    source.start(0);
    const newBuffer = await offlineContext.startRendering();
    return newBuffer;
}

function audioBufferToWav(buffer) {
    let numOfChan = buffer.numberOfChannels,
        length = buffer.length * numOfChan * 2 + 44,
        bufferArray = new ArrayBuffer(length),
        view = new DataView(bufferArray),
        channels = [],
        sample,
        offset = 0,
        pos = 0;

    // Write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    for (let i = 0; i < buffer.numberOfChannels; i++)
        channels.push(buffer.getChannelData(i));

    while (pos < length) {
        for (let i = 0; i < numOfChan; i++) { // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true); // write 16-bit sample
            pos += 2;
        }
        offset++ // next source sample
    }

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }

    return bufferArray;
}

async function applyBassBoost(buffer) {
    const offlineContext = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;

    // бас
    const lowShelfFilter = offlineContext.createBiquadFilter();
    lowShelfFilter.type = 'lowshelf';
    lowShelfFilter.frequency.setValueAtTime(150, offlineContext.currentTime); // частота 150 Hz
    lowShelfFilter.gain.setValueAtTime(6, offlineContext.currentTime); // +6 дБ для баса

    const highCutFilter = offlineContext.createBiquadFilter();
    highCutFilter.type = 'highshelf';
    highCutFilter.frequency.setValueAtTime(3000, offlineContext.currentTime); // частота 3000 Hz
    highCutFilter.gain.setValueAtTime(-2, offlineContext.currentTime); // -2 дБ для баса

    // Подключение фильтров
    source.connect(lowShelfFilter);
    lowShelfFilter.connect(highCutFilter);
    highCutFilter.connect(offlineContext.destination);

    source.start(0);
    const newBuffer = await offlineContext.startRendering();
    return newBuffer;
}

bassBoostCheckbox.addEventListener('change', async () => {
    if (isPlaying) {
        audioBufferSource.stop();
        audioBufferSource.disconnect();
        audioBufferSource = null;

        const file = audioFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const buffer = await audioContext.decodeAudioData(e.target.result);
                let processedBuffer = buffer;

                // бас буст, если чекбокс активен
                if (bassBoostCheckbox.checked) {
                    processedBuffer = await applyBassBoost(buffer);
                }

                audioBufferSource = audioContext.createBufferSource();
                audioBufferSource.buffer = processedBuffer;
                audioBufferSource.connect(gainNode);
                gainNode.connect(analyser);
                analyser.connect(audioContext.destination);
                audioBufferSource.playbackRate.value = speedSlider.value;
                await audioBufferSource.start(0);
                changeIconPlayButton(true);
                isPlaying = true;
            };
            reader.readAsArrayBuffer(file);
        }
    }
});

function updateVisualizer() {
    analyser.getByteFrequencyData(dataArray);
    visualizerContainer.innerHTML = '';

    const barWidth = 5;
    const maxHeight = 100;
    const center = dataArray.length / 2;

    for (let i = 0; i < dataArray.length; i++) {
        const bar = document.createElement('div');
        const normalizedHeight = dataArray[i] / 255; 
        const distanceFromCenter = Math.abs(i - center) / center;
        const scaleFactor = 1 - distanceFromCenter;
        const scaledHeight = normalizedHeight * maxHeight * scaleFactor;

        bar.className = 'visualizer-bar';
        bar.style.height = `${scaledHeight}px`;
        visualizerContainer.appendChild(bar);
    }

    requestAnimationFrame(updateVisualizer);
}

// Запускаем визуализатор
updateVisualizer();