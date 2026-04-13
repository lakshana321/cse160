class Circle {
    constructor() {
      this.type = 'circle';
      this.position = [0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 10.0;
      this.segments = 10;
    }
  
    render() {
      let xy = this.position;
      let rgba = this.color;
      let size = this.size;
      let segments = this.segments;
  
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      let d = size / 200.0;
      let angleStep = 360 / segments;
  
      for (let angle = 0; angle < 360; angle += angleStep) {
        let angle1 = angle;
        let angle2 = angle + angleStep;
  
        let x1 = xy[0] + Math.cos(angle1 * Math.PI / 180) * d;
        let y1 = xy[1] + Math.sin(angle1 * Math.PI / 180) * d;
        let x2 = xy[0] + Math.cos(angle2 * Math.PI / 180) * d;
        let y2 = xy[1] + Math.sin(angle2 * Math.PI / 180) * d;
  
        drawTriangle([
          xy[0], xy[1],
          x1, y1,
          x2, y2
        ]);
      }
    }
  }