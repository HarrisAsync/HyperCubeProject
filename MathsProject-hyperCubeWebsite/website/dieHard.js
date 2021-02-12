const WIDTH_INPUT = $("#table-width");
const HEIGHT_INPUT = $("#table-height");
const SHOW_COORDS = $("#show-coords");
const TARGET = $("#target");
const SUBMIT = $("#submit");
const STEPSIZE = $("#step-size");
const LINETHICKNESS = $("#line-thickness");
const COORDS = $("#coordinates");

$(".p5Canvas").ready(function () {
    $(document).keyup(function (e) {
        if (canvas.is(":focus")) {
            WIDTH_INPUT.val(jugX);
            HEIGHT_INPUT.val(jugY);
        }
    });
});

setInterval(function () { COORDS.val(actualCordsArr.join(", ")); }, 100);

let controls = [WIDTH_INPUT, HEIGHT_INPUT, TARGET, SHOW_COORDS, STEPSIZE, LINETHICKNESS];

for (let control of controls) {
    control.change(update);
    // control.keyup(update);
    control.on("change", update);
}

function update(e) {
    jugX = parseFloat(WIDTH_INPUT.val());
    jugY = parseFloat(HEIGHT_INPUT.val());

    seeCords = SHOW_COORDS.is(":checked");
    water_target = bignumber(TARGET.val());

    laserThickness = parseFloat(LINETHICKNESS.val());
    stepSize = parseFloat(STEPSIZE.val());

    // Change step size:
    WIDTH_INPUT.attr("step", stepSize);
    HEIGHT_INPUT.attr("step", stepSize);
    TARGET.attr("step", stepSize);


    e.preventDefault();

    function validate(val, control) {
        if (math.smallerEq(val, 0) || isNaN(val)) {
            control.addClass("is-invalid");
            return false;
        } else {
            control.removeClass("is-invalid");
            return true;
        }
    }
    let is_valid = validate(jugX, WIDTH_INPUT) && validate(jugY, HEIGHT_INPUT) && validate(water_target, TARGET) && validate(laserThickness, LINETHICKNESS) && validate(stepSize, STEPSIZE);
    if (!is_valid) {
        return;
    }
    resetBoard();
}

$("input[type='number']").inputSpinner();

/*
STEPSIZE.attr("step",'any');
WIDTH_INPUT.attr("step",'any');
HEIGHT_INPUT.attr("step",'any');
TARGET.attr("step",'any');
LINETHICKNESS.attr("step",'any');
*/