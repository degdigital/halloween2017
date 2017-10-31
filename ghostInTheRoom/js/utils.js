export function debounce(fn, delay) {
	var timer = null;
	return () => {
		let context = this;
		let args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(context, args);
		}, delay);
	};
};