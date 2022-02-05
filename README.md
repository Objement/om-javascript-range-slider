# Vanilla JavaScript Range-Slider with two Buttons
This is a really simple to include and to use range slider, implemented in Vanilla JavaScript without the need for any libraries. Just use a range-input, set the attribute "multiple" to it and load the .js- and .css-files. Everything should be fine.

You can set the `min`- and `max`-attributes to the input field to define the maximum range.

The result in the `value`-attribute will be two values (start and end) for the range, separated by a comma.

## How will it look like?

It will look like that:

![Screenshot](/docs/screenshot.png?raw=true "Screenshot of the control")

The colors are changable by overwriting the CSS classes.

You can see an working example of the control by opening the `docs/example.html`.

## Supported Browser

This should work on every browser that supports the ES2015 JavaScript Standard.

Tested so far:
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
<input name="percent_range" type="range" multiple="multiple" min="5" max="100" unit="%" value="">
````

## Usage

### Serverside PHP:

To get the range as an array, you should use the following code:

````PHP
// Will look like this: $_POST['percent_range'] = '1,333';

$range = isset($_POST['percent_range']) && count(explode(',', $_POST['percent_range'])) == 2
             ? array_map(function($value) {
                 $value = filter_var(trim($value), FILTER_VALIDATE_INT, array('flags' => FILTER_NULL_ON_FAILURE));
                 return $value;
             }, explode(',', $_POST['percent_range']))
             : NULL;

var_dump($range);
// Result is:
// array(2) {
//  [0] => int(1)
//  [1] => int(333)
// }
````

To set the value to the input via PHP, just use implode for an array containing two values:

````HTML
<input name="percent_range" type="range" multiple="multiple" min="5" max="100" unit="%" value="<?php echo implode(',', [5,85]); ?>">
````
