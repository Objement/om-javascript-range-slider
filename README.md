# Vanilla JavaScript Range-Slider
This is a really simple to include and to use range slider implemented in Vanilla JavaScript without the need for any libraries. Just use a range-input and set the attribute "multiple" to it and load the .js- and .css-files. Everything should be fine.

You can set the min and max values for the input field. As a result, you will get a two values (start and end) for the range, separated by a comma.

## How will it look like?

It will look like that:

![Screenshot](/doc/screenshot.png?raw=true "Screenshot of the control")

The colors are changable by overwriting the CSS classes.

## Supported Browser

This should work on every browser that supports the ES2015 JavaScript Standard.

Testet so far:
- iOS 15 Safari
- Chromium v98 (Chrome, Brave ...)

## Installation

1. Check out this repository
2. Copy both the .js- and .css-file to your websites asset folder
3. Load these files within your HTML as follows:
````HTML
<html>
	<head>
		...
		<link rel="stylesheet" href="/assets/om-javascript-range-slider.css">
	</head>
	<body>
		...
	
		<script src="/assets/om-javascript-range-slider.js"></script>
	<body>
</html>
````
4. Initialize the library by adding another `<script>`-block containing the following code:
````HTML
...
	<body>
		...
	
		<script src="/assets/om-javascript-range-slider.js"></script>
		
		<script>
			OmRangeSlider.init();
		</script>
	<body>

````
5. Add a range-input somewhere to your `<body>`:
````HTML
<input name="percent_range" type="hidden" multiple="multiple" min="5" max="100" unit="%" value="">
````