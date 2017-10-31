export const TURN_OFF_AUDIO = 'TURN_OFF_AUDIO';
export const BACKGROUND_AUDIO = 'BACKGROUND_AUDIO';

const audioPlayer = function() {

	const audioContext = new (window.AudioContext || window.webkitAudioContext)();

	const audioFiles = [
		{
			id: TURN_OFF_AUDIO,
			url: 'audio/turn-off.mp3',
			buffer: null,
			loop: false
		},
		{
			id: BACKGROUND_AUDIO,
			url: 'audio/halloween-theme.mp3',
			buffer: null,
			loop: true
		}
	];

	function init() {
		audioFiles.forEach(audioFile => {
			fetchAudioFile(audioFile.url)
				.then(buffer => {
					audioFile.buffer = buffer;
					if(audioFile.playOnLoad) {
						playAudio(audioFile.id);
					}
				});
		});
	}

	function fetchAudioFile(src) {
		return fetch(src).then(response => {
			return response.arrayBuffer().then(buffer => {
				return audioContext.decodeAudioData(buffer);
			});
		});
	}

	function createAudioBufferSource(buffer, {loop=false, playbackRate=1.0, delay=0}) {	
		const audioBufferSource = audioContext.createBufferSource();
		audioBufferSource.buffer = buffer;
	    audioBufferSource.loop = loop;
	    audioBufferSource.playbackRate.value = playbackRate;
		audioBufferSource.connect(audioContext.destination);
		audioBufferSource.start(audioContext.currentTime + delay);
		return audioBufferSource;
	}

	function playAudio(id, options) {
		const audioFile = getAudioFile(id);
		if(audioFile) {
			if(audioFile.buffer) {
				audioFile.audioBufferSource = createAudioBufferSource(audioFile.buffer, {...options, loop: audioFile.loop});
			} else {
				audioFile.playOnLoad = true;
			}
		}
	}

	function stopAudio(id) {
		const audioFile = getAudioFile(id);
		if(audioFile && audioFile.audioBufferSource) {
			audioFile.audioBufferSource.stop();
			audioFile.audioBufferSource = null;
		}
	}

	function getAudioFile(id) {
		return audioFiles.find(audioFile => audioFile.id === id);
	}

	function play(audioId, options) {
		playAudio(audioId, options);
	}

	function stop(audioId) {
		stopAudio(audioId);
	}

	init();

	return {
		play: play, 
		stop: stop
	}
}

const instance = audioPlayer();
export default instance;