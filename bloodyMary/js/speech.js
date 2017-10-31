const speech = function(options = {}) {

	const defaults = {
		onSpeechSuccessCallback: null,
		onSpeechCompletionCallback: null
	};
	const words = ['bloody', 'mary'];
	const grammar = `#JSGF V1.0; grammar words; public <color> = ${words.join(' | ')};`;
	const stringToMatch = 'bloodymary';
	let settings;
	let matches = 0;
	let recognition;
	let speechRecognitionList;
	let isEnabled = false;


	function init() {
		if ('webkitSpeechRecognition' in window) {
			settings = Object.assign({}, defaults, options);
			var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
			var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
			var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
			recognition = new SpeechRecognition();
			speechRecognitionList = new SpeechGrammarList();
			speechRecognitionList.addFromString(grammar, 1);
			recognition.lang = 'en-US';
			recognition.continuous = true;
			recognition.interimResults = false;
			recognition.onresult = (e) => onSpeechResult(e.results);
			recognition.start();
			bindEvents();
		}
	}

	function bindEvents() {
		document.addEventListener('click', handleSuccess);
	}

	function onSpeechResult(results) {
		const result = results[results.length - 1][0].transcript; 
		if (result.replace(/ /g,'').toLowerCase() === stringToMatch) {
			handleSuccess();
		}
	}

	function handleSuccess() {
		if (isEnabled === true) {
			matches = matches + 1;
			console.log(matches);
			if (settings.onSpeechSuccessCallback !== null) {
				settings.onSpeechSuccessCallback(matches);
			}
			if (matches === 3) {
				if (settings.onSpeechCompletionCallback !== null) {
					settings.onSpeechCompletionCallback();
				}
			}
		} else {
			console.log('speech not allowed');
		}
	}

	function reset() {
		matches = 0;
	}

	function enable() {
		reset();
		isEnabled = true;
	}

	function disable() {
		reset();
		isEnabled = false;
	}

	init();

	return {
		enable,
		disable
	}

};

export default speech;