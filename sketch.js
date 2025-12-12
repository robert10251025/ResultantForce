let endPointXVector1;
let endPointXVector2;
let endPointYVector1;
let endPointYVector2;

let endPointResultantVectorX;
let endPointResultantVectorY;

let force1 = null;
let force2 = null;
let force1Angle = 0;
let force2Angle = 0;
let resultantForceAngle = 0;
let resultantForceValue = 0;

// ------------- HTML ELEMENTS ---------------------
const componentForces = document.querySelector('#showForces');
const movedCheckbox = document.querySelector('#showMovedForce');
const resultantCheckbox = document.querySelector('#showResultantForce');
const values = document.querySelector('#showValues');

movedCheckbox.addEventListener('change', () => {});

document.querySelectorAll('input[name="direction"]').forEach((r) => {
    r.addEventListener('change', () => {
        mouseDragged();
    });
});

function drawVector(startX, startY, endX, endY, color, dash, forceName, isUp, angle = 0) {
    if (
        startX == null ||
        startY == null ||
        endX == null ||
        endY == null ||
        Number.isNaN(startX) ||
        Number.isNaN(startY) ||
        Number.isNaN(endX) ||
        Number.isNaN(endY)
    )
        return;

    const len = 30;
    beginShape();
    strokeWeight(5);
    stroke(color);
    dash ? drawingContext.setLineDash([10]) : drawingContext.setLineDash([]);
    line(startX, startY, endX, endY);
    drawText(startX, endX, startY, endY, forceName, isUp, color);
    if (endX > startX) {
        line(endX, endY, endX + cos(150 + angle) * len, endY + sin(150 + angle) * len);
        line(endX, endY, endX + cos(-150 + angle) * len, endY + sin(-150 + angle) * len);
    } else {
        line(endX, endY, endX - cos(30 + angle) * len, endY - sin(30 + angle) * len);
        line(endX, endY, endX - cos(-30 + angle) * len, endY - sin(-30 + angle) * len);
    }
    drawingContext.setLineDash([]);
    endShape();
}

function drawText(startX, endX, startY, endY, forceName, isUp, color) {
    noStroke();
    // textSize(28);
    fill('white');
    if (forceName) {
        if (isUp) {
            // textSize(15);
            // text('—>', (startX + endX) / 2, height - 70);
            // textSize(28);
            // text(forceName[0], (startX + endX) / 2, height - 40);
            // textSize(16);
            // text(forceName[1], (startX + endX) / 2 + 10, height - 30);
            textSize(15);
            text('—>', (startX + endX) / 2, (startY + endY) / 2 - 70);
            textSize(28);
            text(forceName[0], (startX + endX) / 2, (startY + endY) / 2 - 40);
            textSize(16);
            text(forceName[1], (startX + endX) / 2 + 10, (startY + endY) / 2 - 30);
        } else {
            textSize(15);
            text('—>', (startX + endX) / 2 - 12, (startY + endY) / 2 + 20);
            textSize(28);
            text(forceName[0], (startX + endX) / 2 - 10, (startY + endY) / 2 + 30 + 20);
            textSize(16);
            text(forceName[1], (startX + endX) / 2, (startY + endY) / 2 + 40 + 20);
        }
    }
    stroke(color);
}

function drawResultantForce(selectedDir) {
    if (resultantCheckbox.checked && force1 && force2) {
        if (selectedDir === 'equal') {
            drawVector(
                width / 2,
                height / 2,
                endPointResultantVectorX,
                height / 2,
                'white',
                false,
                'Fw',
                true,
                endPointResultantVectorX >= width / 2 ? 0 : 180
            );
        } else {
            // calculate angle for resultnat force
            const resultantForce = createVector(
                endPointXVector1 + force2.x - width / 2,
                endPointYVector1 + force2.y - height / 2
            );
            resultantForceValue = resultantForce.mag();
            resultantForceAngle = resultantForce.heading();

            drawVector(
                width / 2,
                height / 2,
                width / 2 + resultantForce.x,
                height / 2 + resultantForce.y,
                'white',
                false,
                'Fw',
                true,
                resultantForceAngle
            );
        }
    }
}

function drawMovedForces(selectedDir) {
    if (movedCheckbox.checked && force1 && force2) {
        if (selectedDir === 'equal') {
            let offset = -20;
            let angle = 0;
            let colorLine = 'green';
            let startPoint = createVector(endPointXVector1, height / 2);
            let endPoint = createVector(endPointXVector1 + force2.x, height / 2);

            if (force1.x > 0 && force2.x > 0) {
                offset = -20;
                colorLine = 'green';
                angle = 0;
            } else if (force1.x > 0 && force2.x < 0) {
                if (abs(force1.x) > abs(force2.x)) {
                    offset = 0;
                    colorLine = 'green';
                    angle = 180;
                } else {
                    colorLine = 'red';
                    offset = 0;
                    angle = 0;
                    startPoint.x = endPointXVector2;
                    endPoint.x = endPointXVector2 + force1.x;
                }
            } else if (force2.x > 0 && force1.x < 0) {
                if (abs(force2.x) > abs(force1.x)) {
                    offset = 0;
                    colorLine = 'red';
                    startPoint.x = endPointXVector2;
                    endPoint.x = endPointXVector2 + force1.x;
                    angle = 180;
                } else {
                    offset = 0;
                    angle = 0;
                }
            } else {
                angle = 180;
            }
            drawVector(
                startPoint.x,
                startPoint.y + offset,
                endPoint.x,
                endPoint.y + offset,
                colorLine,
                true,
                '',
                false,
                angle
            );
        } else {
            // moved force 1
            drawVector(
                endPointXVector2,
                endPointYVector2,
                endPointXVector2 + force1.x,
                endPointYVector2 + force1.y,
                'red',
                true,
                '',
                true,
                force1Angle
            );

            // moved force 2
            drawVector(
                endPointXVector1,
                endPointYVector1,
                endPointXVector1 + force2.x,
                endPointYVector1 + force2.y,
                'green',
                true,
                '',
                true,
                force2Angle
            );
        }
    }
}

function showValues() {
    if (values.checked && force1 && force2) {
        noStroke();
        textAlign(CENTER);
        textSize(40);
        fill('white');
        const selectedDir = getDirectionForce();
        let valuesText;
        if (selectedDir === 'equal') {
            if ((force1.x > 0 && force2.x > 0) || (force1.x < 0 && force2.x < 0)) {
                valuesText = `Fw = ${Math.floor(abs(force1.x))}N + ${Math.floor(
                    abs(force2.x)
                )}N = ${Math.floor(abs(Math.floor(abs(force1.x)) + Math.floor(abs(force2.x))))}N`;
            } else if ((force1.x > 0 && force2.x < 0) || (force1.x < 0 && force2.x > 0)) {
                if (abs(force1.x) >= abs(force2.x)) {
                    valuesText = `Fw = ${Math.floor(abs(force1.x))}N - ${Math.floor(
                        abs(force2.x)
                    )}N = ${Math.floor(
                        abs(Math.floor(abs(force1.x)) - Math.floor(abs(force2.x)))
                    )}N`;
                } else {
                    valuesText = `Fw = ${Math.floor(abs(force2.x))}N - ${Math.floor(
                        abs(force1.x)
                    )}N = ${Math.floor(
                        abs(Math.floor(abs(force2.x)) - Math.floor(abs(force1.x)))
                    )}N`;
                }
            }
            text(valuesText, width / 2, height - 150);
        } else {
            valuesText = `Fw = ${Math.floor(abs(resultantForceValue))}N`;
            text(valuesText, width / 2, height - 100);
        }
    }
}

function getSelectedForce() {
    const checked = document.querySelector('input[name="force"]:checked');
    return checked ? checked.value : null; // np. "force1" albo "force2"
}

function getDirectionForce() {
    const checked = document.querySelector('input[name="direction"]:checked');
    return checked ? checked.value : null;
}

function calculateVector() {
    let resultantForce = createVector(0, 0);
    if (!force1 || !force2) return;
    endPointResultantVectorX = 0;
    endPointResultantVectorY = 0;
    resultantForce = force1.copy();
    resultantForce.add(force2);
    endPointResultantVectorX = width / 2 + resultantForce.x;
    endPointResultantVectorY = height / 2 + resultantForce.y;
}

function mouseDragged() {
    const selectedForce = getSelectedForce();
    const selectedDir = getDirectionForce();

    if (selectedForce === 'force1' && (mouseX <= width) & (mouseY <= height)) {
        endPointXVector1 = mouseX;
        endPointYVector1 = mouseY;
        force1 = createVector(
            endPointXVector1 - width / 2,
            selectedDir === 'equal' ? 0 : endPointYVector1 - height / 2
        );
        force1Angle = force1.heading();
    }
    if (selectedForce === 'force2' && mouseX <= width && mouseY <= height) {
        endPointXVector2 = mouseX;
        endPointYVector2 = mouseY;
        force2 = createVector(
            endPointXVector2 - width / 2,
            selectedDir === 'equal' ? 0 : endPointYVector2 - height / 2
        );
        force2Angle = force2.heading();
    }
    calculateVector();
}

function keyPressed() {
    if (keyCode === 32) {
        const radios = document.querySelectorAll('input[name="force"]');
        const notChecked = [...radios].filter((r) => !r.checked);
        notChecked[0].checked = true;
    }
    if (keyCode === 66) {
        const radios = document.querySelectorAll('input[name="direction"]');
        const notChecked = [...radios].filter((r) => !r.checked);
        notChecked[0].checked = true;
    }
}

// ---------------  p5.js handle  ------------------
function setup() {
    const canvas = createCanvas(1200, 800);
    canvas.parent('canvas-container');
    angleMode(DEGREES);
}

function draw() {
    background(0);
    fill(0, 200, 255);
    noStroke();
    circle(width / 2, height / 2, 100);

    const selectedDir = getDirectionForce();
    if (componentForces.checked) {
        drawVector(
            width / 2,
            selectedDir === 'equal' ? height / 2 - 20 : height / 2,
            endPointXVector1,
            selectedDir === 'equal' ? height / 2 - 20 : endPointYVector1,
            'red',
            false,
            'F1',
            true,
            force1Angle
        );

        drawVector(
            width / 2,
            selectedDir === 'equal' ? height / 2 + 20 : height / 2,
            endPointXVector2,
            selectedDir === 'equal' ? height / 2 + 20 : endPointYVector2,
            'green',
            false,
            'F2',
            false,
            force2Angle
        );
    }

    drawMovedForces(selectedDir);

    drawResultantForce(selectedDir);

    showValues();
}
