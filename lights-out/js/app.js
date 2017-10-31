import reset from '../../js/reset.js';
import imageRevealer from "./imageRevealer.js";
import audioPlayer, {
	SWITCH_AUDIO, 
	LIGHTS_ON_BG_AUDIO, 
	LIGHTS_OUT_BG_AUDIO, 
	SCREAM_AUDIO,
	TURN_ON_AUDIO,
	TURN_OFF_AUDIO} from './audioPlayer.js';

const app = function() {
	const threshold = 2;
	const maxLightsOut = 5;
	let lightsOutCount = 0;
	let sensor; 
	let isLightsOut = false;
	let scheduledPromptId = null;
	let screenEls = [];

	function init() {
		screenEls = Array.from(document.querySelectorAll('.js-screen'));

		window.addEventListener('load', onLoad);
	}

	function onLoad() {
		showScreen('main');

		audioPlayer.play(LIGHTS_ON_BG_AUDIO);
		imageRevealer.showLightsOnImage();
		
		if ("AmbientLightSensor" in window) {
			try {
				sensor = new AmbientLightSensor();
	    		sensor.addEventListener("reading", onAmbientLightChange);
	    		sensor.start();
			} catch(e) {
				console.log(e);
			}	
	    }    

	    document.body.addEventListener('click', onClick); 

	    schedulePrompt(8000);
	}
	
	function onAmbientLightChange() {
		console.log(sensor.illuminance);
		if(sensor.illuminance === null) {
			return;
		}
		if((sensor.illuminance < threshold && !isLightsOut) ||
			(sensor.illuminance >= threshold && isLightsOut)) {
			toggle();	
		}
	}

	function onClick() {
		toggle();
	}

	function toggle() {
		if(isComplete()) {
			return;
		}

		if(isLightsOut) {
			lightsOn();
		} else {
			lightsOut();
		}
	}

	function lightsOn() {
		isLightsOut = false;

		imageRevealer.showLightsOnImage();
		audioPlayer.play(SWITCH_AUDIO);
		audioPlayer.stop(LIGHTS_OUT_BG_AUDIO);
		audioPlayer.play(LIGHTS_ON_BG_AUDIO);

		schedulePrompt(6000 + (lightsOutCount*2000));
	}

	function lightsOut() {
		isLightsOut = true;
		updateLightsOutCount();
		imageRevealer.showLightsOutImage(lightsOutCount);
		audioPlayer.play(SWITCH_AUDIO);
		playLightsOffAudio();
		audioPlayer.stop(LIGHTS_ON_BG_AUDIO);

		if(!isComplete()) {
			schedulePrompt(6000 + (lightsOutCount*2000));
		} else {
			cancelPrompt();
			setTimeout(() => {
				showScreen('complete');
			}, 5000);
		}
	}

	function updateLightsOutCount() {
		if(lightsOutCount < maxLightsOut) {
			lightsOutCount++;
		}
	}

	function playLightsOffAudio() {
		if(lightsOutCount < maxLightsOut) {
			const playbackRate = 0.6 + (.4*lightsOutCount);
			audioPlayer.play(LIGHTS_OUT_BG_AUDIO, { playbackRate });
		} else {
			audioPlayer.play(SCREAM_AUDIO, {delay: 1});
		}
	}

	function cancelPrompt() {
		if(scheduledPromptId){
			clearTimeout(scheduledPromptId);
		}
	}

	function schedulePrompt(delay) {
		cancelPrompt();
		scheduledPromptId = setTimeout(playPrompt, delay);
	}

	function playPrompt() {
		if(isLightsOut) {
			audioPlayer.play(TURN_ON_AUDIO);
		} else {
			audioPlayer.play(TURN_OFF_AUDIO);
		}
	}

	function showScreen(id) {
		screenEls.forEach(screenEl => {
			if(screenEl.id === id) {
				screenEl.classList.remove('hide');
				screenEl.classList.add('fade-in');

				if(id === 'complete') {
					buildCompleteScreen(screenEl);
				}
			} else {	
				screenEl.classList.add('hide');
				screenEl.classList.remove('fade-in');
			}
		});
	}

	function buildCompleteScreen(screenEl) {
		reset({
			illuminanceLevel: threshold,
			containerEl: screenEl
		}).showPrompt();

		audioPlayer.play(LIGHTS_ON_BG_AUDIO);
	}

	function isComplete() {
		return lightsOutCount >= maxLightsOut;
	}

	init();
}

const instance = app();

export default instance;