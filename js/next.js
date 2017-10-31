if ("AmbientLightSensor" in window) {
	var sensor = new AmbientLightSensor();
	sensor.addEventListener("reading", toggleLinks);
	sensor.start();
}

function toggleLinks() {
	if(sensor.illuminance === null) {
		return;
	}
	if(sensor.illuminance < 3)  {
		hideLinks();
	} else if(sensor.illuminance >= 3) {
		showLinks();
	}

}

function showLinks() {
	document.getElementById('Links').classList.remove('disabled');
}

function hideLinks() {
	document.getElementById('Links').classList.add('disabled');
}

export function showEnding() {
	document.getElementById('overlay').classList.add('show');
}
