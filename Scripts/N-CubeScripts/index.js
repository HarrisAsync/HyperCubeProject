'use strict';

//
// Canvas setup
//


window.onresize = function() {
	let additionalSpace = 0;
	if (window.mobileCheck() && screen.availHeight > screen.availWidth) {additionalSpace = window.innerWidth/4}

	HEIGHT = window.innerHeight/2 + additionalSpace;
	WIDTH = window.innerWidth/2 + additionalSpace;
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	init();
}

window.mobileCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// User-set options
var DISTANCE = 3;
var DIMENSION = 4;
var SCALING = 500;
var SPEED = 0.01;
var ISOMETRIC = false;
var ROTATIONS = [[0, 3], [1, 2]];

// Settings and constants
var HEIGHT = window.innerHeight/2;
var WIDTH = window.innerWidth/2;

var FIGURE = void 0;
var NEXTFRAME = void 0;
var ANGLE = void 0;
// I needed a list of all the rotation planes (2 axes) indices
// to avoid generating it every time the user changed the rotation
var ALLROTATIONS = void 0;

// Figure stats, the code doesn't need it, but it's nice to have
var NAMES = ['Square', 'Cube', 'Tesseract', 'Penteract', 'Hexeract', 'Hepteract', 'Octeract', 'Enneract', 'Dekeract'];
var DefaultRotations = [
	[[0,1]], // Square
	[[0, 1], [1, 2]], // Cube
	[[0, 3], [1, 2]], // Tesseract
	[[0, 3], [1, 4]], // Penteract
	[[0, 3], [1, 5]], // Hexeract
	[[0, 3], [1, 6]], // Hepteract
	[[0, 3], [1, 7]], // Octeract
	[[0, 3], [1, 8]], // Enneract
	[[0, 3], [1, 9]], // Dekeract
]

var DefaultScalingNonISO = [
	100, // Square
	250, // Cube
	500, // Tesseract
	1500, // Penteract
	4200, // Hexeract
	9000, // Hepteract
	27000, // Octeract
	95000, // Enneract
	150000 // Dekeract
]

var DefaultScalingISO = [
	100, // Square
	100, // Cube
	100, // Tesseract
	100, // Penteract
	90, // Hexeract
	80, // Hepteract
	70, // Octeract
	70, // Enneract
	60 // Dekeract
]

var VERTICES = void 0,
    EDGES = void 0;

// The init function assumes the 
function init() {
	// Stop animation if there is one
	cancelAnimationFrame(NEXTFRAME);

	// Set canvas dimensions
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	// Center the canvas
	ctx.setTransform(1, 0, 0, 1, WIDTH / 2, HEIGHT / 2);

	// Init global variable
	FIGURE = getVertices(DIMENSION);
	ALLROTATIONS = getListOfRotations(DIMENSION);
	ANGLE = 0;

	// Update the info text
	VERTICES = Math.pow(2, DIMENSION);
	EDGES = DIMENSION * Math.pow(2, DIMENSION - 1);
	document.getElementById('name').innerHTML = NAMES[DIMENSION - 2];
	document.getElementById('info').innerHTML = VERTICES + ' vertices, ' + EDGES + ' edges';

	// Dräw, bröther
	draw();
}

// Start everything
init();
//# sourceMappingURL=index.js.map