import audio from './audio.js';

const mary = function(options = {}) {

	const maryTriggerEl = document.querySelector('.js-mary-trigger');
	const maryEl = document.querySelector('.js-mary');
	const bigMaryEl = document.querySelector('.js-big-mary');
	const activeClass = 'is-active';
	const imageRotationInterval = 1000;
	const defaults = {
		onSuccessCallback: null
	};
	let settings;

	function init() {
		settings = Object.assign({}, defaults, options);
		bindEvents();
	}

	function bindEvents() {
		maryTriggerEl.addEventListener('transitionend', e => {
			if (elIsHidden(e.target)) {
				maryEl.classList.add(activeClass);
				startMirrorAnimation();
			}
		});
	}

	function startMirrorAnimation() {
		let imageIndex = 0;
	    let timer = () => {
			imageIndex++;
			if (imageIndex <= 3) {
				audio.play('glass');
				maryEl.style.backgroundImage = `url('images/mary-${imageIndex}.jpg')`;
				setTimeout(timer, imageRotationInterval);
			} else {
				maryEl.classList.remove(activeClass);
				unleash();
			}
	    };
	    timer();	
	}

	function unleash() {
		audio.stop('background');
		audio.play('scream');
		bigMaryEl.classList.add(activeClass);
		if (settings.onSuccessCallback !== null) {
			settings.onSuccessCallback();
		}
	}

	function hideMary() {
		bigMaryEl.classList.remove(activeClass);
	}

	function elIsHidden(el) {
		return parseInt(getComputedStyle(el).opacity) === 0;
	}
	
	init();

	return {
		hideMary
	}

};

export default mary;