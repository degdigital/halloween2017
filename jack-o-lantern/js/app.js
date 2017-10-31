import reset from '../../js/reset.js';
import audioPlayer, { TURN_OFF_AUDIO, BACKGROUND_AUDIO } from "./audioPlayer.js";
import imageRevealer from "./imageRevealer.js";

const app = function() {
	const threshold = 2;
	let sensor; 
	let isRevealed = false;
	let screenEls = [];

	function init() {
		screenEls = Array.from(document.querySelectorAll('.js-screen'));

		window.addEventListener('load', onLoad);
	}

	function onLoad() {
		showScreen('main');
		document.body.addEventListener('click', onClick);

		if ("AmbientLightSensor" in window) {
			sensor = new AmbientLightSensor();
	    	sensor.addEventListener("reading", onAmbientLightChange, 500);
	    	sensor.start();
	    }

	    setTimeout(playPrompt, 8000);
	}
	
	function onAmbientLightChange() {
		console.log(sensor.illuminance);
		if(sensor.illuminance === null) {
			return;
		}
		if(sensor.illuminance < threshold && !isRevealed)  {
			reveal();
			setTimeout(showEnding, 5000)
		} 
	}

	function onClick() {
		if(!isRevealed) {
			reveal();
		}
	}

	function reveal() {
		isRevealed = true;
		imageRevealer.reveal();
		audioPlayer.play(BACKGROUND_AUDIO);

		setTimeout(() => { showScreen('complete'); }, 12000);
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
				screenEl.classList.remove('fade-in');
				screenEl.classList.add('hide');
			}
		});
	}

	function buildCompleteScreen(screenEl) {
		reset({
			illuminanceLevel: threshold,
			containerEl: screenEl
		}).showPrompt();
	}

	function playPrompt() {
		audioPlayer.play(TURN_OFF_AUDIO);
	}

	init();
}

const instance = app();

export default instance;
