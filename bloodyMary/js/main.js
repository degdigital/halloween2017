import reset from '../../js/reset.js';
import lightsAndSteam from './lightsAndSteam.js';
import speech from './speech.js';
import mary from './mary.js';
import audio from './audio.js'

const userVideoEl = document.querySelector('.js-user-video');
const videoConstraints = {
	audio: false,
	video: {
		height: {
			ideal: 408
		},
		width: {
			ideal: 634
		}
	}
};
let resetInst;
let speechInst;
let lightsAndSteamInst;
let maryInst;

function init() {
	if (navigator.getUserMedia) {
		initUserVideo()
			.then(stream => {
				userVideoEl.srcObject = stream;
				resetInst = reset();
				speechInst = speech({
					onSpeechSuccessCallback: onSpeechSuccess
				});
				lightsAndSteamInst = lightsAndSteam({
					onEnableCallback: onLightsEnable
				});
				maryInst = mary({
					onSuccessCallback: onMarySuccess
				});
				audio.play('background', 'background');
				setTimeout(() => {
					audio.play('turnoffthelights', 'sfx', 0.2);
				}, 7000);
			})
			.catch(error => console.log(error.name));
		
	}
}

function onLightsEnable() {
	speechInst.enable()
}

function onLightsDisable() {
	speechInst.disable()
}

function onSpeechSuccess(matches) {
	lightsAndSteamInst.hideText(matches);
}

function onMarySuccess() {
	lightsAndSteamInst.disable();
	setTimeout(() => {
		// maryInst.hideMary();
		audio.play('turnonthelights', 'sfx', 0.5);
		resetInst.showPrompt();
	}, 5000);
}

function initUserVideo() {
	return navigator.mediaDevices.getUserMedia(videoConstraints)
}

init();
