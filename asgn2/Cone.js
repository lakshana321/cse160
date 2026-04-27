class Cone {
    constructor() {
      this.type = "cone";
      this.color = [1, 1, 1, 1];
      this.matrix = new Matrix4();
      this.segments = 20;
    }
  
    render() {
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      drawCone(this.matrix, this.segments);
    }
  }
  
  function drawCone(M, segments) {
    gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);
  
    let angleStep = 360 / segments;
  
    for (let angle = 0; angle < 360; angle += angleStep) {
      let angle1 = angle * Math.PI / 180;
      let angle2 = (angle + angleStep) * Math.PI / 180;
  
      let x1 = Math.cos(angle1) * 0.5;
      let z1 = Math.sin(angle1) * 0.5;
  
      let x2 = Math.cos(angle2) * 0.5;
      let z2 = Math.sin(angle2) * 0.5;
  
      // Side triangle: base point 1, tip, base point 2
      drawTriangle3D([
        x1, 0, z1,
        0, 1, 0,
        x2, 0, z2
      ]);
  
      // Bottom triangle
      drawTriangle3D([
        0, 0, 0,
        x2, 0, z2,
        x1, 0, z1
      ]);
    }
  }