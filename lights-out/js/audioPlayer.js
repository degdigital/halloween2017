export const SWITCH_AUDIO = 'SWITCH_AUDIO';
export const LIGHTS_ON_BG_AUDIO = 'LIGHTS_ON_BG_AUDIO';
export const LIGHTS_OUT_BG_AUDIO = 'LIGHTS_OUT_BG_AUDIO';	
export const SCREAM_AUDIO = 'SCREAM_AUDIO';
export const TURN_ON_AUDIO = 'TURN_ON_AUDIO';
export const TURN_OFF_AUDIO = 'TURN_OFF_AUDIO';

const audioPlayer = function() {

	const audioContext = new (window.AudioContext || window.webkitAudioContext)();

	const audioFiles = [
		{
			id: SWITCH_AUDIO,
			url: 'audio/switch.mp3',
			buffer: null
		},
		{
			id: LIGHTS_ON_BG_AUDIO,
			url: 'audio/desolation.mp3',
			buffer: null,
			loop: true
		},
		{
			id: LIGHTS_OUT_BG_AUDIO,
			url: 'audio/heartbeat.mp3',
			buffer: null,
			loop: true
		},
		{
			id: SCREAM_AUDIO,
			url: 'audio/scream.mp3',
			buffer: null,
			loop: false
		},
		{
			id: TURN_ON_AUDIO,
			url: 'audio/turn-on.mp3',
			buffer: null,
			loop: false
		},
		{
			id: TURN_OFF_AUDIO,
			url: 'audio/turn-off.mp3',
			buffer: null,
			loop: false
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