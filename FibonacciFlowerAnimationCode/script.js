// Vars
var c = 10;
var maxBuds = 1000;
var angle = 137.5;
let findSpiral = true;
let windW = 1000;
let windH = 500;
var budFillClick = [208,240,192];
let fps = 60;
var budArr;
var k = 0;
let budRadius = 12;

function findBudLocations(lim) {
    // Get the bud locations prior to drawing them
    var budLocationArr = [];
    for (let n = 0; n < lim; n++) {
        var a = n * angle;
        var r = c * Math.sqrt(n);
    
        var x = r * Math.cos(a) + width/2; 
        var y = r * Math.sin(a) + height/2;
        budLocationArr.push([x,y]);
    }
    return budLocationArr;
}

function TwoDDistance(x1,y1, x2, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2)
}

function getNearest(xTargert, yTarget) {
    let minDis = Infinity;
    let minX;
    let minY;
    for (let index = 0; index < budArr.length; index++) {

        // Get current bud location
        let x = budArr[index][0];
        let y = budArr[index][1];

        // If the current bud is closer, set it as min
        let currentDis = TwoDDistance(x, y, xTargert, yTarget);
        if (currentDis < minDis && currentDis!=0) {
            minDis = currentDis;
            minX = x;
            minY = y;
        }
    }
    return [minX,minY];
}

function drawConnectingLine(x,y) {
    let nearestCords = getNearest(x,y);
    let nearestX = nearestCords[0];
    let nearestY = nearestCords[1];

    stroke(244,244,244);
    strokeWeight(2.5);
    line(x,y,nearestX,nearestY);
}

function drawAllConnectingLines() {
    for (let index = 0; index < budArr.length; index++) {
        let x = budArr[index][0];
        let y = budArr[index][1];
        drawConnectingLine(x,y);
    }
}

function findFlowerRange() {
    let xMin, xMax;
    let yMin, yMax;
    //budArr;
}

function mapPoints(points, xMax, yMax, pads) {
    let arr = [];
    for (point of points) {
        arr.push([map(point.x, 0, xMax, pads, windW - pads),map(Math.abs(point.y-yMax), 0, yMax, pads, windH - pads)]);
    }
    return arr;
}

function mapPoint(point, xMax, yMax, pads) {
    return [map(point.x, 0, xMax, pads, windW - pads),map(Math.abs(point.y-yMax), 0, yMax, pads, windH - pads)];
}


function setup() {
    windW = windowWidth;
    windH = windowHeight;
    createCanvas(windW, windH);
    background(color('#000000'));
    frameRate(fps);
    // Get Bud Locations
    budArr = findBudLocations(maxBuds);
}

function drawBud() {
    // Get cords
    let mappedPoint = budArr[k]
    let x = mappedPoint[0];
    let y = mappedPoint[1];
    // Draw bud 
    // Colour scaling
    let c1 = map(x, 0, windW, 0, 254);
    let c2 = map(y, 0, windH, 0, 254);
    
    fill(0, c1, c2);
    ellipse(x, y, budRadius);
}


function draw() {
    // Draw Bud
    drawBud();
    // Draw connecting lines then Stop drawing or Increment k.
    if (k + 1 < budArr.length) {
        k++;
    } else {
        if (findSpiral) {
            // Draw all connecting lines
            drawAllConnectingLines();
        }
        noLoop();
    }
}

function resetCanvas() {
    background(color('#000000'));
    // Get Bud Locations
    budArr = findBudLocations(maxBuds);
    var k = 0;
}

function changeBudColor() {
    // Check if mouse is inside the circle
    currentMX = mouseX;
    currentMY = mouseY;

    for (let index = 0; index < k+1; index++) {
        let d = TwoDDistance(currentMX, currentMY, budArr[index][0], budArr[index][1]);
        if (d < budRadius/2) {
            fill(budFillClick);
            noStroke();
            ellipse(budArr[index][0], budArr[index][1], budRadius);
        }   
    }
}

function mouseClicked() {
    changeBudColor();
}

function mouseDragged() {
    changeBudColor();
}