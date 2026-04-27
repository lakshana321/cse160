var VSHADER_SOURCE = `
  attribute vec3 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotation;

  void main() {
    gl_Position = u_GlobalRotation * u_ModelMatrix * vec4(a_Position, 1.0);
  }
`;

var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;

  void main() {
    gl_FragColor = u_FragColor;
  }
`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotation;

let gAnimalGlobalRotation = 0;
let gTailAngle = 0;
let gPawAngle = 0;
let gThighAngle = 0;
let gCalfAngle = 0;

let g_startTime = performance.now() / 1000.0; // seconds
let g_time = 0;

let g_animation = false;

let gHeadAngle = 0;
let gEarAngle = 0;
let gBodyBob = 0;
let gBackLegAngle = 0;

let gAnimalGlobalRotationX = 0;
let gAnimalGlobalRotationY = 0;
let g_mouseDown = false;
let g_lastMouseX = 0;
let g_lastMouseY = 0;

let g_pokeAnimation = false;
let g_pokeStartTime = 0;
let gPokeJump = 0;
let gPokeWiggle = 0;

let g_lastFrameTime = performance.now();
let g_fps = 0;

function main() {
  canvas = document.getElementById("webgl");

  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    console.log("Failed to get WebGL context");
    return;
  }

  gl.enable(gl.DEPTH_TEST);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  u_GlobalRotation = gl.getUniformLocation(gl.program, "u_GlobalRotation");

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  document.getElementById("angleSlide").addEventListener("mousemove", function () {
    gAnimalGlobalRotation = this.value;
    renderScene();
  });
  document.getElementById("tailSlide").addEventListener("mousemove", function () {
    gTailAngle = this.value;
    renderScene();
  });
  
  document.getElementById("pawSlide").addEventListener("mousemove", function () {
    gPawAngle = this.value;
    renderScene();
  });

  document.getElementById("thighSlide").addEventListener("mousemove", function () {
    gThighAngle = Number(this.value);
    renderScene();
  });
  
  document.getElementById("calfSlide").addEventListener("mousemove", function () {
    gCalfAngle = Number(this.value);
    renderScene();
  });

  document.getElementById("animOn").onclick = function() {
    g_animation = true;
  };
  
  document.getElementById("animOff").onclick = function() {
    g_animation = false;
  };

  canvas.onmousedown = function(ev) {
    g_mouseDown = true;
    g_lastMouseX = ev.clientX;
    g_lastMouseY = ev.clientY;
  };
  
  canvas.onmouseup = function() {
    g_mouseDown = false;
  };
  
  canvas.onmousedown = function(ev) {
    if (ev.shiftKey) {
      g_pokeAnimation = true;
      g_pokeStartTime = g_time;
      return;
    }
  
    g_mouseDown = true;
    g_lastMouseX = ev.clientX;
    g_lastMouseY = ev.clientY;
  };

  renderScene();
  requestAnimationFrame(tick);
}

function renderScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    var globalRotMat = new Matrix4();
    globalRotMat.rotate(gAnimalGlobalRotation, 0, 1, 0);      // slider rotation
    globalRotMat.rotate(gAnimalGlobalRotationX, 1, 0, 0);     // mouse up/down
    globalRotMat.rotate(gAnimalGlobalRotationY, 0, 1, 0);     // mouse left/right
    gl.uniformMatrix4fv(u_GlobalRotation, false, globalRotMat.elements);
  
    // ================= BODY =================
    var body = new Matrix4();
    body.translate(-0.5, -0.4 + gBodyBob + gPokeJump, 0.0);
    body.scale(1.0, 0.5, 0.6);
    gl.uniform4f(u_FragColor, 0.8, 0.6, 0.4, 1.0);
    drawCube(body);
  
    // ================= HEAD =================
    var head = new Matrix4();
    head.translate(0.4, -0.2 + gBodyBob + gPokeJump, 0.1);
    head.rotate(gHeadAngle, 0, 0, 1);
    head.scale(0.4, 0.4, 0.4);
    gl.uniform4f(u_FragColor, 0.8, 0.6, 0.4, 1.0);
    drawCube(head);
  
    // ================= CONE EARS =================
    var ear1 = new Cone();
    ear1.color = [0.6, 0.4, 0.2, 1.0];
    ear1.matrix.translate(0.48, 0.18 + gBodyBob + gPokeJump, 0.22);
    ear1.matrix.rotate(gEarAngle, 0, 0, 1);
    ear1.matrix.scale(0.18, 0.28, 0.18);
    ear1.render();

    var ear2 = new Cone();
    ear2.color = [0.6, 0.4, 0.2, 1.0];
    ear2.matrix.translate(0.72, 0.18 + gBodyBob + gPokeJump, 0.22);
    ear2.matrix.rotate(-gEarAngle, 0, 0, 1);
    ear2.matrix.scale(0.18, 0.28, 0.18);
    ear2.render();
  
    // ================= TAIL =================
    var tail = new Matrix4();
    tail.translate(-0.8, -0.1, 0.25);
    tail.rotate(45 + gTailAngle, 0, 0, 1);
    tail.scale(0.5, 0.1, 0.1);
    gl.uniform4f(u_FragColor, 0.6, 0.4, 0.2, 1.0);
    drawCube(tail);


    tail.scale(0.5, 0.1, 0.1);
    gl.uniform4f(u_FragColor, 0.6, 0.4, 0.2, 1.0);
    drawCube(tail);
  
    // ================= BACK LEGS =================
    var backLeg1 = new Matrix4();
    backLeg1.translate(-0.4, -0.9 + gBodyBob + gPokeJump, 0.1);
    backLeg1.rotate(gBackLegAngle, 0, 0, 1);
    backLeg1.scale(0.15, 0.5, 0.15);
    drawCube(backLeg1);
    
    var backLeg2 = new Matrix4();
    backLeg2.translate(-0.1, -0.9 + gBodyBob + gPokeJump, 0.4);
    backLeg2.rotate(-gBackLegAngle, 0, 0, 1);
    backLeg2.scale(0.15, 0.5, 0.15);
    drawCube(backLeg2);
  
    // ================= FRONT RIGHT LEG =================
    var frontLeg2 = new Matrix4();
    frontLeg2.translate(0.3, -0.9, 0.4);
    frontLeg2.scale(0.15, 0.5, 0.15);
    drawCube(frontLeg2);
  
    // ================= FRONT LEFT LEG: 3 JOINT CHAIN =================

    // Joint 1: thigh connects to body
    var thigh = new Matrix4();
    thigh.translate(0.25, -0.5 + gBodyBob + gPokeJump, 0.1);
    thigh.rotate(10 + gThighAngle, 0, 0, 1);

    var thighDraw = new Matrix4(thigh);
    thighDraw.scale(0.15, 0.35, 0.15);
    gl.uniform4f(u_FragColor, 0.65, 0.35, 0.18, 1.0);
    drawCube(thighDraw);

    // Joint 2: calf connects to thigh
    var calf = new Matrix4(thigh);
    calf.translate(0, -0.35, 0);
    calf.rotate(-20 + gCalfAngle, 0, 0, 1);

    var calfDraw = new Matrix4(calf);
    calfDraw.scale(0.13, 0.35, 0.13);
    gl.uniform4f(u_FragColor, 0.6, 0.3, 0.15, 1.0);
    drawCube(calfDraw);

    // Joint 3: paw connects to calf
    var paw = new Matrix4(calf);
    paw.translate(0.02, -0.35, 0);
    paw.rotate(gPawAngle, 0, 0, 1);

    var pawDraw = new Matrix4(paw);
    pawDraw.scale(0.28, 0.12, 0.18);
    gl.uniform4f(u_FragColor, 0.3, 0.2, 0.1, 1.0);
    drawCube(pawDraw);
}

function tick() {
    let now = performance.now();
    g_time = now / 1000.0;
  
    let delta = now - g_lastFrameTime;
    g_lastFrameTime = now;
  
    g_fps = 1000 / delta;
  
    document.getElementById("performance").innerHTML =
      "FPS: " + Math.round(g_fps);
  
    updateAnimationAngles();
    renderScene();
  
    requestAnimationFrame(tick);
}

function updateAnimationAngles() {
    if (g_animation) {
      gTailAngle = 25 * Math.sin(3 * g_time);
  
      gHeadAngle = 8 * Math.sin(2 * g_time);
      gEarAngle = 5 * Math.sin(4 * g_time);
      gBodyBob = 0.03 * Math.sin(2 * g_time);
  
      gThighAngle = 20 * Math.sin(2 * g_time);
      gCalfAngle = 20 * Math.sin(2 * g_time + 1);
      gPawAngle = 15 * Math.sin(2 * g_time + 2);
  
      gBackLegAngle = -15 * Math.sin(2 * g_time);
    }
  
    if (g_pokeAnimation) {
      let pokeTime = g_time - g_pokeStartTime;
  
      gPokeJump = 0.25 * Math.sin(pokeTime * 8);
      gPokeWiggle = 20 * Math.sin(pokeTime * 20);
  
      gTailAngle = 70 * Math.sin(pokeTime * 18);
      gHeadAngle = gPokeWiggle;
      gEarAngle = -25;
  
      if (pokeTime > 1.0) {
        g_pokeAnimation = false;
        gPokeJump = 0;
        gPokeWiggle = 0;
      }
    }
}
