export class Particle {
  constructor (x, y, cellSize, particleRadius) {
    this.x = x;
    this.y = y;
    // this.oldx = x;
    // this.oldy = y;
    // this.g = 0;
    this.pressure = 0;
    this.nearPressure = 0;
    this.cellSize = cellSize;
    this.halfCell = cellSize / 2;
    this.particleRadius = particleRadius;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
  };

  gradient (other) {
    const distance = Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    return 1 - distance / this.particleRadius;
  };

  neighbours (others) {
    let neighbours = [];
    for (const other of others) {
      if (this.x == other.x && this.y == other.y) continue;

      const distance = (this.x - other.x) ** 2 + (this.y - other.y) ** 2;

      if (distance >= this.particleRadius ** 2) continue;
      else if (distance == 0) continue;

      const g = this.gradient(other);

      other.g = g;
      neighbours.push(other);
    };
    return neighbours;
  };

  updatePressure (neighbours) {
    let density = 0, nearDensity = 0;

    for (const other of neighbours) {
      const g = other.g;

      density += g ** 2;
      nearDensity += g ** 3;

      this.pressure = 800 * (density - 3);
      this.nearPressure = 2000 * nearDensity;
    };
  };

  relax (neighbours, dt) {
    const displacement = [0, 0];

    for (let n of neighbours) {
      const g = n.g;
      const mag = this.pressure * g + this.nearPressure * g ** 2;

      const vec = [n.x - this.x, n.y - this.y];
      const length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
      if (length === 0) continue;

      const dir = [vec[0] / length, vec[1] / length];
      const force = [dir[0] * mag, dir[1] * mag];

      const dv = [force[0] * dt * dt, force[1] * dt ** 2];

      displacement[0] -= 0.5 * dv[0];
      displacement[1] -= 0.5 * dv[1];

      n.x += 0.5 * dv[0];
      n.y += 0.5 * dv[1];
    }

    this.x += displacement[0];
    this.y += displacement[1];
  }
  
  updateVelocity (dt) {
    const changes = [this.x - this.oldx, this.y - this.oldy];
    this.vx = changes[0] / dt;
    this.vy = changes[1] / dt;
  };

  update (dt) {
    this.oldx = this.x;
    this.oldy = this.y;

    this.vy += (9.8 / 0.008) * dt;
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  };

  render (display) {
    // display.fillRect(this.x - this.halfCell, this.y - this.halfCell, this.cellSize, this.cellSize);
    display.beginPath();
    display.arc(this.x, this.y, this.particleRadius / 4, 0, 2 * Math.PI);
    display.fill();
  };
};
