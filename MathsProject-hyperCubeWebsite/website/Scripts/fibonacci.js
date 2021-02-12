// Vars
var c = 1; // Keep 1
var maxBuds = 1000; // can never be 0
var angle = 137.5;
let budRadius = 12;
var budFillClick = [142, 229, 193];
let findSpiral = true;
let minColourBud = 100;
let maxColourBud = 200;
let windW = 700; // Make sure dimentions are square
let windH = 700; // Make sure dimentions are square

let fps = 60;
var budArr;
var colouredBudsArr = [];
var k = 0;

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

function findBudLocations(lim) {
    // Get the bud locations prior to drawing them
    var budLocationArr = [];
    for (let n = 0; n < lim; n++) {
        var a = n * angle;
        var r = c * Math.sqrt(n);
    
        var x = r * Math.cos(a); 
        var y = r * Math.sin(a);
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

    stroke(244);
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

function findFlowerBounds(actualBurArr) {
    let xMin = actualBurArr[0][0];
    let yMin = actualBurArr[0][1]; 

    let xMax = actualBurArr[0][0];
    let yMax = actualBurArr[0][1];

    for (let index = 0; index < actualBurArr.length; index++) {
        let x = actualBurArr[index][0];
        let y = actualBurArr[index][1];
        if (x < xMin) {xMin = x;}
        if (y < yMin) {yMin = y;}
        if (x > xMax) {xMax = x;}
        if (y > yMax) {yMax = y;}
    }
    return [xMin,xMax,yMin,yMax];
}

function mapPoints(points, xMin, xMax, yMin, yMax) {
    let arr = [];
    for (point of points) {
        arr.push([map(point[0]-xMin, 0, xMax, 0, windW/2),map(point[1]-yMin, 0, yMax, 0, windH/2)]);
    }
    return arr;
}

function setup() {
    //windW = windowWidth;
    //windH = windowHeight;
    let container = $("#container");
    let size = Math.min(container.width(), container.height());
    windW = size;
    windH = size;
    let cnv = createCanvas(windW, windH);
    cnv.parent('container');
    frameRate(fps);
    resetCanvas();
}

function windowResized() {
    let container = $("#container");
    let size = Math.min(container.width(), container.height());
    windW = size;
    windH = size;
    resizeCanvas(windW, windH);
    resetCanvas();
}

function drawBud(budIndex) {
    // Get cords
    let mappedPoint = budArr[budIndex];
    let x = mappedPoint[0];
    let y = mappedPoint[1];
    // Draw bud 
    // Colour scaling
    let c1 = map(x, 0, windW, minColourBud, maxColourBud);
    let c2 = map(y, 0, windH, minColourBud, maxColourBud);
    
    fill(0, c1, c2);
    ellipse(x, y, budRadius);
}


function draw() {
    // Draw Bud
    drawBud(k);
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
    let bounds = findFlowerBounds(budArr);
    budArr = mapPoints(budArr,bounds[0],bounds[1],bounds[2],bounds[3])
    k = 0;
    loop();
}

function changeBudColor() {
    if (findSpiral) {
        return;
    }

    // Check if mouse is inside the circle
    currentMX = mouseX;
    currentMY = mouseY;

    for (let index = 0; index < k+1; index++) {
        let d = TwoDDistance(currentMX, currentMY, budArr[index][0], budArr[index][1]);
        if (d < budRadius/2) {
            if (colouredBudsArr.includes(budArr[index]))
            {   
                let cindex = colouredBudsArr.indexOf(budArr[index]);
                colouredBudsArr.splice(cindex, 1);
                stroke(0);
                strokeWeight(1);
                drawBud(index);

            } else {
                push();
                stroke(0);
                strokeWeight(1);
                fill(budFillClick);
                ellipse(budArr[index][0], budArr[index][1], budRadius);
                pop();
                colouredBudsArr.push(budArr[index]);
            }
        }   
    }
}

function mouseClicked() {
    changeBudColor();
}

/*
function mouseDragged() {
    changeBudColor();
}
*/