const audio = function() {

	const bodyEl = document.body;
	const backgroundAudioClass = 'js-audio-background';
	const sfxAudioClass = 'js-audio-sfx';
	let playerEls;

	function init() {
		bodyEl.insertAdjacentHTML('beforeend', `
			<audio class="${backgroundAudioClass}" loop></audio>
			<audio class="${sfxAudioClass}"></audio>
		`);
		playerEls = {
			background: document.querySelector(`.${backgroundAudioClass}`),
			sfx: document.querySelector(`.${sfxAudioClass}`)
		};
	}

	function play(filename, playerName = 'sfx', volume = 1) {
		const playerEl = playerEls[playerName];
		playerEl.src = `audio/${filename}.mp3`;
		playerEl.volume = volume;
		playerEl.play();
	}

	function stop(playerName = 'background') {
		const playerEl = playerEls[playerName];
		playerEl.pause();
		playerEl.currentTime = 0;
	}

	init();

	return {
		play,
		stop
	}

};

const instance = audio();

export default instance;