var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

let g_shapesList = [];
let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectedSize = 10.0;
let g_selectedSegments = 10;

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let g_selectedType = POINT;

class Point {
  constructor() {
    this.type = 'point';
    this.position = [0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 10.0;
  }

  render() {
    let xy = this.position;
    let rgba = this.color;
    let size = this.size;

    gl.disableVertexAttribArray(a_Position);
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1f(u_Size, size);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function addActionsForHtmlUI() {
  document.getElementById('redSlide').addEventListener('input', function() {
    g_selectedColor[0] = Number(this.value) / 100;
  });

  document.getElementById('greenSlide').addEventListener('input', function() {
    g_selectedColor[1] = Number(this.value) / 100;
  });

  document.getElementById('blueSlide').addEventListener('input', function() {
    g_selectedColor[2] = Number(this.value) / 100;
  });

  document.getElementById('alphaSlide').addEventListener('input', function() {
    g_selectedColor[3] = Number(this.value) / 100;
  });

  document.getElementById('sizeSlide').addEventListener('input', function() {
    g_selectedSize = Number(this.value);
  });

  document.getElementById('segmentSlide').addEventListener('input', function() {
    g_selectedSegments = Number(this.value);
  });

  document.getElementById('pointButton').onclick = function() {
    g_selectedType = POINT;
  };

  document.getElementById('triangleButton').onclick = function() {
    g_selectedType = TRIANGLE;
  };

  document.getElementById('circleButton').onclick = function() {
    g_selectedType = CIRCLE;
  };

  document.getElementById('clearButton').onclick = clearCanvas;
  document.getElementById('drawPictureButton').onclick = drawMyPicture;
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {
    if (ev.buttons == 1) {
      click(ev);
    }
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);

  let shape = null;

  if (g_selectedType === POINT) {
    shape = new Point();
  } else if (g_selectedType === TRIANGLE) {
    shape = new Triangle();
  } else if (g_selectedType === CIRCLE) {
    shape = new Circle();
    shape.segments = g_selectedSegments;
  }

  if (!shape) return;

  shape.position = [x, y];
  shape.color = [
    g_selectedColor[0],
    g_selectedColor[1],
    g_selectedColor[2],
    g_selectedColor[3]
  ];
  shape.size = g_selectedSize;

  g_shapesList.push(shape);
  renderAllShapes();
}

function clearCanvas() {
  g_shapesList = [];
  renderAllShapes();
}

function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < g_shapesList.length; i++) {
    g_shapesList[i].render();
  }
}

function convertCoordinatesEventToGL(ev) {
  let x = ev.clientX;
  let y = ev.clientY;
  let rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return [x, y];
}

function drawColoredTriangle(vertices, color) {
  gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
  drawTriangle(vertices);
}

function drawMyPicture() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawColoredTriangle([ 0.00,  0.55, -0.10,  0.35,  0.10,  0.35], [1.0, 0.4, 0.7, 1.0]);
  drawColoredTriangle([ 0.38,  0.38,  0.18,  0.28,  0.28,  0.18], [1.0, 0.4, 0.7, 1.0]);
  drawColoredTriangle([ 0.55,  0.00,  0.35,  0.10,  0.35, -0.10], [1.0, 0.4, 0.7, 1.0]);
  drawColoredTriangle([ 0.38, -0.38,  0.28, -0.18,  0.18, -0.28], [1.0, 0.4, 0.7, 1.0]);
  drawColoredTriangle([ 0.00, -0.55, -0.10, -0.35,  0.10, -0.35], [1.0, 0.4, 0.7, 1.0]);
  drawColoredTriangle([-0.38, -0.38, -0.18, -0.28, -0.28, -0.18], [1.0, 0.4, 0.7, 1.0]);
  drawColoredTriangle([-0.55,  0.00, -0.35,  0.10, -0.35, -0.10], [1.0, 0.4, 0.7, 1.0]);
  drawColoredTriangle([-0.38,  0.38, -0.28,  0.18, -0.18,  0.28], [1.0, 0.4, 0.7, 1.0]);

  drawColoredTriangle([ 0.00,  0.18, -0.18,  0.00,  0.00,  0.00], [1.0, 0.85, 0.2, 1.0]);
  drawColoredTriangle([ 0.18,  0.00,  0.00,  0.18,  0.00,  0.00], [1.0, 0.85, 0.2, 1.0]);
  drawColoredTriangle([ 0.00, -0.18,  0.18,  0.00,  0.00,  0.00], [1.0, 0.75, 0.1, 1.0]);
  drawColoredTriangle([-0.18,  0.00,  0.00, -0.18,  0.00,  0.00], [1.0, 0.75, 0.1, 1.0]);

  drawColoredTriangle([-0.03, -0.18,  0.03, -0.18, -0.03, -0.78], [0.1, 0.7, 0.2, 1.0]);
  drawColoredTriangle([ 0.03, -0.18,  0.03, -0.78, -0.03, -0.78], [0.1, 0.7, 0.2, 1.0]);

  drawColoredTriangle([-0.03, -0.45, -0.32, -0.55, -0.10, -0.30], [0.0, 0.6, 0.2, 1.0]);
  drawColoredTriangle([-0.03, -0.45, -0.24, -0.22, -0.10, -0.30], [0.0, 0.75, 0.25, 1.0]);
  drawColoredTriangle([ 0.03, -0.58,  0.32, -0.48,  0.10, -0.40], [0.0, 0.6, 0.2, 1.0]);
  drawColoredTriangle([ 0.03, -0.58,  0.24, -0.80,  0.10, -0.40], [0.0, 0.75, 0.25, 1.0]);

  drawColoredTriangle([-0.72, -0.35, -0.66, -0.35, -0.72, -0.80], [1.0, 1.0, 1.0, 1.0]);
  drawColoredTriangle([-0.66, -0.35, -0.66, -0.80, -0.72, -0.80], [1.0, 1.0, 1.0, 1.0]);
  drawColoredTriangle([-0.72, -0.80, -0.45, -0.80, -0.72, -0.88], [1.0, 1.0, 1.0, 1.0]);
  drawColoredTriangle([-0.45, -0.80, -0.45, -0.88, -0.72, -0.88], [1.0, 1.0, 1.0, 1.0]);

  drawColoredTriangle([-0.90, -0.92, -0.70, -0.92, -0.80, -0.70], [0.0, 0.5, 0.1, 1.0]);
  drawColoredTriangle([-0.45, -0.92, -0.25, -0.92, -0.35, -0.68], [0.0, 0.55, 0.1, 1.0]);
  drawColoredTriangle([ 0.20, -0.92,  0.40, -0.92,  0.30, -0.70], [0.0, 0.5, 0.1, 1.0]);
  drawColoredTriangle([ 0.55, -0.92,  0.80, -0.92,  0.67, -0.66], [0.0, 0.55, 0.1, 1.0]);
}