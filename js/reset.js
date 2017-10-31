import {debounce} from './utils.js';

const reset = function(options = {}) {

	const defaults = {
		illuminanceLevel: 10,
		containerEl: document.body
	};
	const replayTriggerClass = 'js-replay-trigger';
	const chooseanotherTriggerClass = 'js-chooseanother-trigger';
	const lightsAreOnClass = 'reset-lights-are-on';
	const visibleClass = 'reset-is-visible';
	let sensor;
	let settings;

	function init() {
		if ('AmbientLightSensor' in window) {
			settings = Object.assign({}, defaults, options);
			initAmbient();
			renderOverlay();
			bindEvents();
		} 
	}

	function renderOverlay() {
		settings.containerEl.insertAdjacentHTML('afterbegin', `
			<div class="reset">
				<div class="reset-text-container">
					<img class="reset-text" src="/img/lightsontext.png">
					<ul class="reset-links">
						<li>
							<button class="reset-link ${replayTriggerClass}">Replay</button>
						</li>
						<li>
							<button class="reset-link ${chooseanotherTriggerClass}">Choose Another</button>
						</li>
					</ul>
				</div>
			</div>
		`);
	}

	function bindEvents() {
		document.addEventListener('click', e => {
			const cls = e.target.classList;
			if (cls.contains(replayTriggerClass)) {
				location.reload();
			}
			if (cls.contains(chooseanotherTriggerClass)) {
				location.href = '/index.html';
			}
		});
	}

	function initAmbient() {
		sensor = new AmbientLightSensor();
		sensor.addEventListener('reading', debounce(onAmbientLightChange, 500));
		sensor.start();
	}

	function onAmbientLightChange() {
		const method = sensor.illuminance >= settings.illuminanceLevel ? 'add' : 'remove';
		settings.containerEl.classList[method](lightsAreOnClass);
	}

	function showPrompt() {
		settings.containerEl.classList.add(visibleClass);
	}

	init();

	return {
		showPrompt
	}

};

export default reset;
