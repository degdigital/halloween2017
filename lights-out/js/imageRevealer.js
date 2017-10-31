const imageRevealer = function() {

	let lightsOnImage;
	let lightsOutImages; 
	let currentLightsOutImage;

	function init() {
		lightsOnImage = document.querySelector('[data-lights-on]');
		lightsOutImages = Array.from(document.querySelectorAll('[data-lights-out]'));
	}

	function showLightsOutImage(count) {
		toggleImage(lightsOnImage);
		currentLightsOutImage = getLightsOutImageForCount(count);
		if(currentLightsOutImage) {
			toggleImage(currentLightsOutImage);
			if(currentLightsOutImage.dataset.zoom) {
				zoomImage(currentLightsOutImage);
			}
		}
	}

	function showLightsOnImage() {
		if(currentLightsOutImage) {
			toggleImage(currentLightsOutImage);
		}
		toggleImage(lightsOnImage);
	}

	function getLightsOutImageForCount(count) {
		return lightsOutImages.find(image => {
			const imageCount = Number.parseInt(image.dataset.count);
			return imageCount === count;
		});
	}

	function toggleImage(image) {
		image.classList.toggle('hide');
	}

	function zoomImage(image) {
		image.classList.add('zoom');
	}

	init();

	return {
		showLightsOutImage: showLightsOutImage,
		showLightsOnImage: showLightsOnImage
	}
}

const instance = imageRevealer();
export default instance;