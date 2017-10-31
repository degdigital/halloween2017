const imageRevealer = function() {

	const defaultImage = document.querySelector('.js-default');
	const revealImage = document.querySelector('.js-reveal');

	function reveal() {
		defaultImage.classList.add('hide');
		revealImage.classList.remove('hide');
		revealImage.classList.add('zoom');
	}

	return {
		reveal: reveal
	}
}

const instance = imageRevealer();
export default instance;