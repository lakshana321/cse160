function main() {
  var canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawVector(v, color) {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');

  var x = v.elements[0] * 20;
  var y = v.elements[1] * 20;

  var originX = canvas.width / 2;
  var originY = canvas.height / 2;

  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + x, originY - y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function clearCanvas() {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getV1() {
  var x1 = parseFloat(document.getElementById('xcoord1').value) || 0;
  var y1 = parseFloat(document.getElementById('ycoord1').value) || 0;
  return new Vector3([x1, y1, 0]);
}

function getV2() {
  var x2 = parseFloat(document.getElementById('xcoord2').value) || 0;
  var y2 = parseFloat(document.getElementById('ycoord2').value) || 0;
  return new Vector3([x2, y2, 0]);
}

function handleDrawEvent() {
  clearCanvas();

  var v1 = getV1();
  var v2 = getV2();

  drawVector(v1, "red");
  drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
  clearCanvas();

  var v1 = getV1();
  var v2 = getV2();

  drawVector(v1, "red");
  drawVector(v2, "blue");

  var op = document.getElementById('operation').value;
  var scalar = parseFloat(document.getElementById('scalar').value) || 0;

  if (op === "add") {
    var v3 = new Vector3(v1.elements);
    v3.add(v2);
    drawVector(v3, "green");
  }
  else if (op === "sub") {
    var v3 = new Vector3(v1.elements);
    v3.sub(v2);
    drawVector(v3, "green");
  }
  else if (op === "mul") {
    var v3 = new Vector3(v1.elements);
    var v4 = new Vector3(v2.elements);
    v3.mul(scalar);
    v4.mul(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
  else if (op === "div") {
    var v3 = new Vector3(v1.elements);
    var v4 = new Vector3(v2.elements);
    v3.div(scalar);
    v4.div(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
  else if (op === "magnitude") {
    console.log("Magnitude v1: " + v1.magnitude());
    console.log("Magnitude v2: " + v2.magnitude());
  }
  else if (op === "normalize") {
    var v3 = new Vector3(v1.elements);
    var v4 = new Vector3(v2.elements);
    v3.normalize();
    v4.normalize();
    drawVector(v3, "green");
    drawVector(v4, "green");
  }

  else if (op === "angle") {
    let angle = angleBetween(v1, v2);
    console.log("Angle:", angle);
  }

  else if (op === "area") {
    let area = areaTriangle(v1, v2);
    console.log("Area of the triangle:", area);
  }
}

function angleBetween(v1, v2) {
  let dot = Vector3.dot(v1, v2);
  let mag1 = v1.magnitude();
  let mag2 = v2.magnitude();

  let cosAlpha = dot / (mag1 * mag2);

  // Clamp to avoid floating point issues
  cosAlpha = Math.min(1, Math.max(-1, cosAlpha));

  let angleRad = Math.acos(cosAlpha);
  let angleDeg = angleRad * (180 / Math.PI);

  return angleDeg;
}

function areaTriangle(v1, v2) {
  let crossProduct = Vector3.cross(v1, v2);
  let area = crossProduct.magnitude() / 2;
  return area;
}