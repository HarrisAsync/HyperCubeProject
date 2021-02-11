const WIDTH_INPUT = $("#table-width");
const HEIGHT_INPUT = $("#table-height");
const SHOW_COORDS = $("#show-coords");
const TARGET = $("#target");
const SUBMIT = $("#submit");

SUBMIT.click(function (e) {
    jugX = parseFloat(WIDTH_INPUT.val());
    jugY = parseFloat(HEIGHT_INPUT.val());
    seeCords = SHOW_COORDS.is(":checked");
    water_target = bignumber(TARGET.val());
    e.preventDefault();
    
    resetBoard();
});