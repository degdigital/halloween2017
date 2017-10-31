import {debounce, ensureArray} from '../../js/utils.js';
import audio from './audio.js';

const lightsAndSteam = function(options = {}) {

	const bodyEl = document.body;
	const bathroomEl = document.querySelector('.js-bathroom');
	const steamEl = document.querySelector('.js-steam');
	const steamTextEls = Array.from(document.querySelectorAll('.js-steam-text'));
	const userVideoEl = document.querySelector('.js-user-video');
	const lightsOffClass = 'lights-are-off';
	const activeClass = 'is-active';
	const hiddenClass = 'is-hidden';
	const defaults = {
		illuminanceLevel: 5,
		onEnableCallback: null
	};
	let lightChangeHasFired = false;
	let isDisabled = false;
	let settings;
	let sensor;

	function init() {
		if ('AmbientLightSensor' in window) {
			settings = Object.assign({}, defaults, options);
			initAmbient();
			bindEvents();
		} 
	}

	function bindEvents() {
		bathroomEl.addEventListener('transitionend', e => {
			if (getComputedStyle(e.target, ':before').opacity > 0) {
				enable([steamEl, userVideoEl], activeClass);
			}
		});
	}

	function initAmbient() {
			sensor = new AmbientLightSensor();
			sensor.addEventListener('reading', debounce(onAmbientLightChange, 500));
			sensor.start();
	}

	function onAmbientLightChange() {
		if (isDisabled === false && sensor.illuminance <= settings.illuminanceLevel) {
			if (lightChangeHasFired === false) {
				lightChangeHasFired = true;
				setTimeout(() => {
					audio.play('saymyname', 'sfx', 0.2);
				}, 2100);
				enable();
			}
		}
	}

	function hideText(matches) {
		const matchingEl = steamTextEls[parseInt(matches) - 1];
		if (matchingEl) {
			matchingEl.classList.add(hiddenClass);
		}
	}

	function enable(els = bodyEl, cls = lightsOffClass) {
		els = ensureArray(els);
		els.forEach(el => el.classList.add(cls));
		if (settings.onEnableCallback !== null) {
			settings.onEnableCallback();
		}
	}

	function disable() {
		isDisabled = true;
	}

	init();

	return {
		enable,
		disable,
		hideText
	};

};

export default lightsAndSteam;