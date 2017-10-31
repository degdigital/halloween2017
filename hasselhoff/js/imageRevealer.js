const imageRevealer = function() {

	const imageFg = document.querySelector('.image--fg');
	const imageBg = document.querySelector('.image--bg');
	const backdrop = document.querySelector('.backdrop'); 

	function reveal() {
		toggle(true);
	}

	function hide() {
		toggle(false);
	}

	function toggle(reveal) {
		imageFg.classList.toggle('hide', reveal);
		imageBg.classList.toggle('hide', !reveal);
		backdrop.classList.toggle('hide', !reveal);
	}

	return {
		reveal: reveal,
		hide: hide
	}
}

const instance = imageRevealer();
export default instance;