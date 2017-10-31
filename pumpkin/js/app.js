import audioPlayer from "./audioPlayer.js";
import imageRevealer from "./imageRevealer.js";
import { debounce } from "./debounce.js";
import { showEnding  } from "../../js/next.js";

const app = function() {
	const threshold = 3;
	let sensor; 
	let isRevealed = false;

	function init() {
		document.body.addEventListener('click', onClick);

		if ("AmbientLightSensor" in window) {
			sensor = new AmbientLightSensor();
	    	sensor.addEventListener("reading", debounce(onAmbientLightChange, 500));
	    	sensor.start();
	    }
	}
	
	function onAmbientLightChange() {
		console.log(sensor.illuminance);
		if(sensor.illuminance === null) {
			return;
		}
		if(sensor.illuminance < threshold && !isRevealed)  {
			reveal();
			setTimeout(showEnding, 5000)
		} else if(sensor.illuminance >= threshold && isRevealed) {
			hide();
		}
	}

	function onClick() {
		if(isRevealed) {
			hide();
		} else {
			reveal();
		}
	}

	function reveal() {
		console.log('reveal');
		isRevealed = true;
		imageRevealer.reveal();
		audioPlayer.play();
	}

	function hide() {
		console.log('hide');
		isRevealed = false;
		imageRevealer.hide();
		audioPlayer.stop();
	}

	init();
}

const instance = app();

export default instance;
