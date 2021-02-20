'use strict';

/*
Note: Every form is for ONE option
the form ID should match the initalizer CONTROLS.init.{name}
and the oninput callback CONTROLS.callback.{name}
*/

function CONTROLS() { }

CONTROLS.DOM = {
	// All the container form elements
	'forms': {
		'rotations': document.getElementById('rotations'),
		'dimension': document.getElementById('dimension'),
		'scaling': document.getElementById('scaling'),
		'isometric': document.getElementById('isometric'),
		'speed': document.getElementById('speed'),
		'distance': document.getElementById('distance')
	},
	// The child values, for reference
	'children': {}

	//
	// Initalization
	//

}; CONTROLS.init = function () {
	/*
 Note: Looping through all the individual initializers to call them all
 Also add the callbacks and disable form submission
 */

	var forms = Object.keys(this.init);

	for (var i = 0; i < forms.length; i++) {
		this.init[forms[i]].call(this);


		this.DOM.forms[forms[i]].oninput = this.callback[forms[i]].bind(this);

		// onchange is for the checkboxes on mobile touch devices
		if (mobileCheck()) {
			this.DOM.forms[forms[i]].onchange = this.callback[forms[i]].bind(this);
		}

		this.DOM.forms[forms[i]].onsubmit = function () {
			return false;
		};
	}
};

CONTROLS.init.dimension = function () {
	/*
 Note: Create a number input for the dimension number
 */
	var input = document.createElement('input');
	input.type = 'range';
	input.classList.add("form-range");
	input.classList.add("white");
	input.min = 2;
	input.max = 10;
	input.step = 1;
	input.value = DIMENSION;
	document.getElementById("dimentionValue").innerHTML = DIMENSION;

	this.DOM.children.dimension = input;
	this.DOM.forms.dimension.appendChild(input);
};

CONTROLS.init.scaling = function () {
	/*
 Note: Create a number input for the scaling
 */

	var input = document.createElement('input');

	input.type = 'number';
	input.value = SCALING;
	input.step = 20;
	input.classList.add("form-control");
	this.DOM.children.scaling = input;
	this.DOM.forms.scaling.appendChild(input);
};

CONTROLS.init.speed = function () {
	/*
 Note: Create a number input for the scaling
 */

	var input = document.createElement('input');
	input.type = 'range';
	input.classList.add("form-range");
	input.value = SPEED;
	input.min = -0.05;
	input.max = 0.05;
	input.step = 0.001;
	input.value = SPEED;
	document.getElementById("speedValue").innerHTML = SPEED  + " radians per frame";
	this.DOM.children.speed = input;
	this.DOM.forms.speed.appendChild(input);
};

CONTROLS.init.distance = function () {
	/*
 Note: Create a number input for the scaling
 */

	var input = document.createElement('input');
	input.type = 'number';
	input.value = DISTANCE;
	input.step = 0.1;
	input.classList.add("form-control");
	this.DOM.children.distance = input;
	this.DOM.forms.distance.appendChild(input);
};

CONTROLS.init.isometric = function () {
	/*
 Note: Create a checkbox input for the isometric projection
 */

	var checkbox = document.createElement('input');
	checkbox.classList.add("form-check-input");
	checkbox.type = 'checkbox';
	checkbox.id = 'isometric-checkbox';
	if (ISOMETRIC) {
		checkbox.checked = true;
	}

	var label = document.createElement('label');
	label.innerHTML = ''; // Adding content with CSS, boi
	label.htmlFor = 'isometric-checkbox';

	this.DOM.children.isometric = checkbox;
	this.DOM.forms.isometric.appendChild(checkbox);
	this.DOM.forms.isometric.appendChild(label);
};

CONTROLS.init.rotations = function () {
	/*
 Note: Here I'm creating the inputs for the rotation matrices
 The checkboxes are in a form which gets triggered when any input changes
 I'm creating checkboxes + label then appending it to the form innerHTML
 */

	var checkbox = void 0,
		label = void 0,
		text = void 0;
	var activeRotations = JSON.stringify(ROTATIONS);

	// Reset the form
	this.DOM.forms.rotations.innerHTML = '';
	// Reset the children
	this.DOM.children.rotations = [];

	for (var i = 0; i < ALLROTATIONS.length; i++) {
		text = getAxisName(ALLROTATIONS[i][0]) + getAxisName(ALLROTATIONS[i][1]);

		checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = text;
		// Check if the rotation of the checkbox is active = present in ROTATIONS
		if (activeRotations.indexOf(JSON.stringify(ALLROTATIONS[i])) !== -1) {
			checkbox.checked = true;
		}

		label = document.createElement('label');
		label.id = text + "L";
		label.htmlFor = text;
		label.innerHTML = text;

		// Add Style
		label.style.padding = "5px";
		checkbox.style.display = 'none';
		label.classList.add("noselect");
		label.style.color = "#cccccc";
		label.style.cursor = "pointer";
		if (checkbox.checked) {
			label.style.color = "#1D5E3E";
		}


		this.DOM.children.rotations[i] = checkbox;
		this.DOM.forms.rotations.appendChild(checkbox);

		this.DOM.forms.rotations.appendChild(label);
	}
};

//
// Callbacks
//

CONTROLS.callback = {};

CONTROLS.callback.dimension = function () {
	var value = parseInt(this.DOM.children.dimension.value);

	// If the value is not a number (NaN), quit
	if (isNaN(value)) {
		return false;
	}

	// Take the value and clamp it between [2, 10]
	// Dimension 10 has 1024 vertices, which is a lot
	value = Math.min(10, Math.max(2, value));

	// Ka-bam, reset everything
	DIMENSION = value;

	// Index of default rotation array is: value - 2 
	ROTATIONS = DefaultRotations[value - 2];

	// Scaling
	if (!ISOMETRIC) {
		SCALING = DefaultScalingNonISO[value - 2];
	} else {
		SCALING = DefaultScalingISO[value - 2];
	}
	document.getElementById('scaling').children[0].value = SCALING;
	document.getElementById("dimentionValue").innerHTML = DIMENSION;
	init();
	// Update the rotation options for the new dimension 
	CONTROLS.init.rotations.call(this);
};

CONTROLS.callback.scaling = function () {
	var value = parseFloat(this.DOM.children.scaling.value);

	// If the value is not a number (NaN), quit
	if (isNaN(value)) {
		return false;
	}

	SCALING = value;
};

CONTROLS.callback.speed = function () {
	var value = parseFloat(this.DOM.children.speed.value);

	// If the value is not a number (NaN), quit
	if (isNaN(value)) {
		return false;
	}

	SPEED = value;
	document.getElementById("speedValue").innerHTML = SPEED  + " radians per frame";
};

CONTROLS.callback.distance = function () {
	var value = parseFloat(this.DOM.children.distance.value);

	// If the value is not a number (NaN), quit
	if (isNaN(value)) {
		return false;
	}

	DISTANCE = value;
};

CONTROLS.callback.isometric = function () {
	ISOMETRIC = this.DOM.children.isometric.checked;

	// Scaling
	if (!ISOMETRIC) {
		SCALING = DefaultScalingNonISO[DIMENSION - 2];
	} else {
		SCALING = DefaultScalingISO[DIMENSION - 2];
	}
	document.getElementById('scaling').children[0].value = SCALING;
};

CONTROLS.callback.rotations = function () {
	/*
 Note: Here I'm looping through all the rotation checkboxes
 If they are checked, add its rotation name (= elmt.value) to the global ROTATIONS variable
 */

	ROTATIONS = [];
	var checkbox = void 0;

	for (var i = 0; i < this.DOM.children.rotations.length; i++) {
		checkbox = this.DOM.children.rotations[i];
		let label = document.getElementById(this.DOM.children.rotations[i].id + "L");
		if (checkbox.checked) {
			ROTATIONS.push(ALLROTATIONS[i]);

			// Style Change
			label.style.color = "#1D5E3E";
		} else {
			// Style Change
			label.style.color = "#cccccc";
		}
	}
};

//
// Start everything
//

CONTROLS.init();
//# sourceMappingURL=controls.js.map