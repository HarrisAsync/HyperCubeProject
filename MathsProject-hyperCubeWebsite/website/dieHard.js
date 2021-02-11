const WIDTH_INPUT = $("#table-width");
const HEIGHT_INPUT = $("#table-height");
const SHOW_COORDS = $("#show-coords");
const TARGET = $("#target");
const SUBMIT = $("#submit");

let controls = [WIDTH_INPUT, HEIGHT_INPUT, TARGET, SHOW_COORDS];

for (let control of controls) {
    control.change(update);
    control.keyup(update);
    control.on("change", update)
}

function update(e) {
    jugX = parseFloat(WIDTH_INPUT.val());
    jugY = parseFloat(HEIGHT_INPUT.val());
    seeCords = SHOW_COORDS.is(":checked");
    water_target = bignumber(TARGET.val());
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
    let is_valid = validate(jugX, WIDTH_INPUT) && validate(jugY, HEIGHT_INPUT) && validate(water_target, TARGET);
    if (!is_valid) {
        return;
    }
    resetBoard();
}

SUBMIT.click(update);