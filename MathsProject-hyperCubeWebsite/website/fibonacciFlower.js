const ANGLE = $("#angle");
const SHOW_LINES = $("#show-lines");
const RESET = $("#reset");

let controls = [ANGLE, SHOW_LINES, RESET];

const GOLDEN_ANGLE = math.number(math.bignumber(180).mul(math.bignumber(3).sub(math.bignumber(math.sqrt(5)))));

let update_obj = {
    _angle: 0,
    _findSpiral: false,
    get angle() {
        return this._angle;
    },
    set angle(new_val) {
        this._angle = new_val;
        angle = new_val;
        ANGLE.val(new_val);
        resetCanvas();
    },
    get findSpiral() {
        return this._findSpiral
    },
    set findSpiral(new_val) {
        this._findSpiral = new_val;
        findSpiral = new_val;
        resetCanvas();
    },
};

$(document).ready(function () {
    $("input[type='number']").inputSpinner();

    update_obj.angle = GOLDEN_ANGLE;
    update_obj.findSpiral = findSpiral;
    for (let control of controls) {
        control.change(function (e) {
            update_obj.angle = parseFloat(ANGLE.val());
            update_obj.findSpiral = SHOW_LINES.is(":checked");
        });
    };

    iSHOW_LINES.prop("checked", findSpiral);

    RESET.click(function (e) {
        update_obj.angle = GOLDEN_ANGLE;
    });
});