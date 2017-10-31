const audioPlayer = function() {

	const audioContext = new (window.AudioContext || window.webkitAudioContext)();
	let audioBufferSource = null;
	let gainNode = null;
	let buffer = null;
	let isPlayPending = false;

	function init() {
		fetchAudioFile();
	}

	function fetchAudioFile() {
		fetch("audio/halloween-theme.mp3").then(response => {
			response.arrayBuffer().then(buffer => {
				audioContext.decodeAudioData(buffer).then(onAudioDataDecoded);
			});
		});
	}

	function onAudioDataDecoded(data) {
		buffer = data;
		if(isPlayPending) {
			isPlayPending = false;
			createAudioBufferSource();
		}
	}

	function createAudioBufferSource() {
		if(buffer !== null) {
			gainNode = audioContext.createGain();
			//gainNode.gain.setValueAtTime(0, audioContext.currentTime);
			
			audioBufferSource = audioContext.createBufferSource();
			audioBufferSource.buffer = buffer;
		    audioBufferSource.loop = true;
			
			//audioBufferSource.connect(audioContext.destination);
			audioBufferSource.connect(gainNode);
			gainNode.connect(audioContext.destination);
			

			audioBufferSource.start(0);
		} else {
			isPlayPending = true;
		}
	}

	function play() {
		if(audioBufferSource === null) {
			createAudioBufferSource();		
		} else {
			console.log(gainNode.gain);
			gainNode.gain.exponentialRampToValueAtTime(1.0, audioContext.currentTime + 2);
		}

	}

	function stop() {
		if(audioBufferSource !== null) {
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
		}
	}

	init();

	return {
		play: play,
		stop: stop
	}
}

const instance = audioPlayer();
export default instance;