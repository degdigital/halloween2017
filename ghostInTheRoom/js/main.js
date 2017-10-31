import {debounce} from './utils.js';

const userVideoEl = document.querySelector('.js-uservideo');
const audioEl = document.querySelector('.js-audio');
const overlayEl = document.querySelector('.js-overlay');
const ghostClass = 'is-ghosty';
const illuminanceLevel = 2;
const videoConstraints = {
	audio: false,
	video: {
		height: {
			ideal: 1080
		},
		width: {
			ideal: 1920
		}
	}
};
let sensor;

function init() {
	initAmbient();
	initUserVideo();
}

function initAmbient() {
	if ('AmbientLightSensor' in window) {
		sensor = new AmbientLightSensor();
		sensor.addEventListener('reading', debounce(onAmbientLightChange, 500));
		sensor.start();
	} 
}

function initUserVideo() {
	navigator.mediaDevices.getUserMedia(videoConstraints)
		.then(stream => userVideoEl.srcObject = stream)
		.catch(err => console.log(err));
}

function onAmbientLightChange() {
	if (sensor.illuminance <= illuminanceLevel) {
		audioEl.currentTime = 0;
		audioEl.play();
		overlayEl.classList.add(ghostClass);
	} else {
		audioEl.pause();
		audioEl.currentTime = 0;
		overlayEl.classList.remove(ghostClass);
	}
}

init();
