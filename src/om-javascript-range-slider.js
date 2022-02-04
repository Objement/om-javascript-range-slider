function OmRangeSlider(inputSelector) {
	const that = this;

	let input = undefined;
	let element = undefined;
	let elementRange = undefined;
	let buttonStart = undefined;
	let buttonEnd = undefined;
	let rangeIndicator = undefined;
	let displayValueStart = undefined;
	let displayValueEnd = undefined;

	let rangeValue = undefined;

	let debug = false;

	this.settings = {
		min: 0,
		max: 10,
		unit: ''
	};
	const settings = this.settings;

	this.setRange = function (range) {
		rangeValue = range;
		displayValueStart.textContent = range[0] + settings.unit;
		displayValueEnd.textContent = range[1] + settings.unit;
		triggerRangeChangeEvent(range);
		input.value = rangeValue.join(',');
		return that;
	};

	this.setDebug = function (enabled) {
		debug = !!enabled;
		return that;
	}

	function initEventSubscriptions() {
		let previousWindowWidth = document.documentElement.clientWidth;

		const sliderMouseEventHelper = new SliderMouseEventHelper(buttonStart, buttonEnd, rangeIndicator);

		window.addEventListener('resize', (e) => {
			if (sliderMouseEventHelper.getActiveButton() === undefined || previousWindowWidth !== document.documentElement.clientWidth.toFixed()) {
				previousWindowWidth = document.documentElement.clientWidth.toFixed();
				refreshButtonPositions();
				refreshRangeIndicator();
			}
		}, {passive: false});

		buttonStart.addEventListener('mousedown', sliderMouseEventHelper.onButtonGrabbed, {passive: false});
		buttonStart.addEventListener('touchstart', sliderMouseEventHelper.onButtonGrabbed, {passive: false});
		buttonStart.addEventListener('touchend', sliderMouseEventHelper.onButtonRelease, {passive: false});
		buttonStart.addEventListener('touchcancel', sliderMouseEventHelper.onButtonRelease, {passive: false});
		buttonEnd.addEventListener('mousedown', sliderMouseEventHelper.onButtonGrabbed, {passive: false});
		buttonEnd.addEventListener('touchstart', sliderMouseEventHelper.onButtonGrabbed, {passive: false});
		buttonEnd.addEventListener('touchend', sliderMouseEventHelper.onButtonRelease, {passive: false});
		buttonEnd.addEventListener('touchcancel', sliderMouseEventHelper.onButtonRelease, {passive: false});

		window.addEventListener('mouseup', sliderMouseEventHelper.onButtonRelease, {passive: false});
		window.addEventListener('touchend', sliderMouseEventHelper.onButtonRelease, {passive: false});
		window.addEventListener('touchcancel', sliderMouseEventHelper.onButtonRelease, {passive: false});

		window.addEventListener('mousemove', sliderMouseEventHelper.onButtonMove, {passive: false});
		window.addEventListener('touchmove', sliderMouseEventHelper.onButtonMove, {passive: false});

		window.addEventListener('mouseout', (e) => {
			if (e.toElement == null && e.relatedTarget == null) {
				sliderMouseEventHelper.onButtonRelease(e);
			}
		}, {passive: false});
	}

	function initVisuals(inputElement) {

		input = inputElement;

		const visualSliderContainer = document.createElement('div');
		visualSliderContainer.className = input.className;
		for (const stylePropertyName in input.style) {
			visualSliderContainer.style[stylePropertyName] = input.style[stylePropertyName];
		}
		if (!visualSliderContainer.style.height) {
			visualSliderContainer.style.height = input.offsetHeight + 'px';
		}

		visualSliderContainer.classList.add('om-sliderrange');
		const visualSliderRange = document.createElement('div');
		visualSliderRange.classList.add('om-sliderrange-range');
		const visualSliderRangeIndicator = document.createElement('div');
		visualSliderRangeIndicator.classList.add('om-sliderrange-range-indicator');
		const visualSliderButtonStart = document.createElement('div');
		visualSliderButtonStart.role = 'button';
		visualSliderButtonStart.classList.add('om-sliderrange-button-start');
		visualSliderButtonStart.innerHTML = '<div style="position: relative; height: 100%; width: 100%;"><div style="position: absolute; height: 48px; width: 48px; top: 50%; left: 50%; transform: translateY(-50%) translateX(-50%);' + (debug ? ' background: rgba(71,178,71,0.6);' : '') + '"></div></div>';
		const visualSliderButtonEnd = document.createElement('div');
		visualSliderButtonEnd.role = 'button';
		visualSliderButtonEnd.classList.add('om-sliderrange-button-end');
		visualSliderButtonEnd.innerHTML = '<div style="position: relative; height: 100%; width: 100%;"><div style="position: absolute; height: 48px; width: 48px; top: 50%; left: 50%; transform: translateY(-50%) translateX(-50%);' + (debug ? '  background: rgba(178,71,71,0.6);' : '') + '"></div></div>';

		visualSliderRange.appendChild(visualSliderRangeIndicator);
		visualSliderRange.appendChild(visualSliderButtonStart);
		visualSliderRange.appendChild(visualSliderButtonEnd);

		visualSliderContainer.appendChild(visualSliderRange);

		const visualDisplayContainer = document.createElement('div');
		visualDisplayContainer.className = 'om-sliderrange-display';

		const visualDisplayValueStart = document.createElement('span');
		visualDisplayValueStart.textContent = '0';
		const visualDisplayValueEnd = document.createElement('span');
		visualDisplayValueEnd.textContent = '10';
		const visualDisplaySeparator = document.createElement('span');
		visualDisplaySeparator.textContent = '-';
		visualDisplayContainer.appendChild(visualDisplayValueStart);
		visualDisplayContainer.appendChild(visualDisplaySeparator);
		visualDisplayContainer.appendChild(visualDisplayValueEnd);

		visualSliderContainer.appendChild(visualDisplayContainer);

		input.parentNode.insertBefore(visualSliderContainer, input.nextSibling);

		visualSliderButtonEnd.style.left = (visualSliderRange.getBoundingClientRect().width - visualSliderButtonEnd.getBoundingClientRect().width) + 'px';

		element = visualSliderContainer;
		elementRange = visualSliderRange;
		buttonStart = visualSliderButtonStart;
		buttonEnd = visualSliderButtonEnd;
		rangeIndicator = visualSliderRangeIndicator;
		displayValueStart = visualDisplayValueStart;
		displayValueEnd = visualDisplayValueEnd;
		settings.min = input.getAttribute('min')
			? input.getAttribute('min') : 0;
		settings.max = input.getAttribute('max')
			? input.getAttribute('max') : 10;
		settings.unit = input.getAttribute('unit') ?? '';

		that.setRange([settings.min, settings.max]);
		refreshButtonPositions();

		input.type = 'hidden';
	}

	function refreshButtonPositions() {
		const range = settings.max - settings.min;

		buttonStart.style.left = Math.round((rangeValue[0] - settings.min) * elementRange.clientWidth / range) + 'px';
		buttonEnd.style.left = Math.round(((rangeValue[1] - settings.min) * elementRange.clientWidth / range) - buttonEnd.clientWidth) + 'px';
	}

	function refreshRangeIndicator() {
		rangeIndicator.style.left = parseInt(buttonStart.style.left) + (buttonStart.getBoundingClientRect().width / 2) + 'px';
		rangeIndicator.style.right = elementRange.getBoundingClientRect().width - parseInt(buttonEnd.style.left) - (buttonEnd.getBoundingClientRect().width / 2);
	}

	function triggerRangeChangeEvent(range) {
		const event = new CustomEvent('rangechange', range);
		input.value = this.range ? this.range.join(',') : '';
		input.dispatchEvent(event);
	}

	function updateValues() {
		const rangePx = elementRange.offsetWidth - buttonStart.offsetWidth - buttonEnd.offsetWidth;
		const startPx = parseInt(buttonStart.style.left);
		const endPx = parseInt(buttonEnd.style.left) - buttonEnd.offsetWidth;

		const isFloat = parseFloat(settings.min) % 1 !== 0 || parseFloat(settings.max) % 1 !== 0;

		const diffRange = settings.max - settings.min;
		let resultStart = (diffRange / rangePx * startPx) + parseFloat(settings.min);
		let resultEnd = (diffRange / rangePx * endPx) + parseFloat(settings.min);

		if (!isFloat) {
			resultStart = +Math.ceil(resultStart);
			resultEnd = +Math.ceil(resultEnd);
		}

		refreshRangeIndicator();

		that.setRange([resultStart, resultEnd]);
	}

	function SliderMouseEventHelper(buttonStart, buttonEnd, rangeIndicator) {
		let x = 0;
		let activeButton = null;

		this.getActiveButton = function () {
			return activeButton;
		}

		this.onButtonGrabbed = function (e) {
			// The touch area of the buttons are bigger than they are visually. Because of that, the touch area overlaps, in case that the buttons are positioned
			// for a small range. Do determine, which button on touch/click should be moved, we check, if the X is behind the starting of the endbutton.
			// The end button touch area always overlaps the start button, because of the Z-index (it is the latter added button).
			const buttonStartPosStart = buttonStart.getBoundingClientRect()?.left ?? undefined;
			const buttonEndPosStart = buttonEnd.getBoundingClientRect()?.left ?? undefined;
			let buttonStartPosEnd = undefined;
			let halfDistanceBetweenButtons = undefined;
			if (buttonStartPosStart && buttonEndPosStart) {
				buttonStartPosEnd = buttonStartPosStart + buttonStart.getBoundingClientRect().width;
				halfDistanceBetweenButtons = (buttonStartPosEnd - buttonStartPosStart) / 2;
			}

			if (halfDistanceBetweenButtons !== undefined && e.currentTarget === buttonEnd) {
				if (getXOfMoveEvent(e) < buttonStartPosEnd + halfDistanceBetweenButtons) {
					activeButton = buttonStart;
				} else {
					activeButton = buttonEnd;
				}
			} else {
				activeButton = e.currentTarget;
			}

			x = activeButton.offsetLeft - getXOfMoveEvent(e);
		}

		this.onButtonRelease = function (e) {
			if (!activeButton)
				return;

			x = activeButton.offsetLeft - getXOfMoveEvent(e);

			activeButton = undefined;
		}

		this.onButtonMove = function (e) {
			if (activeButton) {
				e.preventDefault();
				e.stopImmediatePropagation();

				let newX = getXOfMoveEvent(e);

				newX = getValidX(activeButton, newX);

				if (newX !== parseInt(activeButton.style.left)) {
					activeButton.style.left = newX + 'px';
					refreshRangeIndicator();
					updateValues();
				}
			}
		}

		function getXOfMoveEvent(e) {
			if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
				const evt = !e.originalEvent ? e : e.originalEvent;
				const touch = evt.touches[0] || evt.changedTouches[0];

				return touch.pageX || touch.clientX;
			} else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
				return e.clientX;
			} else {
				return undefined;
			}
		}

		function getValidX(button, clientX) {
			let newX = clientX + x;

			if (button === buttonStart) {
				if (newX <= 0) {
					newX = 0;
				} else if (newX + buttonStart.getBoundingClientRect().width >= parseInt(buttonEnd.style.left)) {
					newX = parseInt(buttonEnd.style.left) - buttonStart.getBoundingClientRect().width;
				}
			} else if (button === buttonEnd) {
				if (newX >= elementRange.getBoundingClientRect().width - buttonEnd.getBoundingClientRect().width) {
					newX = elementRange.getBoundingClientRect().width - buttonEnd.getBoundingClientRect().width;
				} else if (newX <= buttonStart.getBoundingClientRect().width + parseInt(buttonStart.style.left)) {
					newX = buttonStart.getBoundingClientRect().width + parseInt(buttonStart.style.left);
				}
			}
			return parseInt(newX);
		}
	}

	this.initialize = function () {
		initVisuals(inputSelector);
		initEventSubscriptions();
	};
}

OmRangeSlider.init = function (selector = 'input[type=range][multiple]') {
	const rangeSliders = document.querySelectorAll(selector);
	for (let i = 0; i < rangeSliders.length; i++) {
		(new OmRangeSlider(rangeSliders[i]))
			.setDebug(false)
			.initialize();
	}
}