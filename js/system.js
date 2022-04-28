import {Particle} from "./particle.js";

export class System {
  constructor (canvas, particleNum, cellSize, sensitivity) {
    if (canvas.getContext) {
      this.display = canvas.getContext("2d");
      this.display.fillStyle = "#03a1fc";
    } else {
      console.error("Your browser does not support HTML canvas");
    };

    this.particles = [];

    for (let i = 0; i < particleNum; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      this.particles.push(new Particle(x, y, cellSize, (cellSize / 2) ** 2));
    };

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight":
          for (const particle of this.particles) {
            particle.vx += sensitivity;
          };
          break;
        case "ArrowLeft":
          for (const particle of this.particles) {
            particle.vx -= sensitivity;
          };
          break;
        case "ArrowUp":
          for (const particle of this.particles) {
            particle.vy -= sensitivity;
          };
        case "ArrowDown":
          for (const particle of this.particles) {
            particle.vy += sensitivity;
          };
      };
    });

    this.dt = 0.01664;
  };

  update () {
    for (const particle of this.particles) {
      particle.update(this.dt);
    };

    for (const particle of this.particles) {
      const neighbours = particle.neighbours(this.particles);
      particle.updatePressure(neighbours);
      particle.relax(neighbours, this.dt);
    };

    const width = window.innerWidth, height = window.innerHeight;

    for (const particle of this.particles) {
      if (particle.x < 0) {
      particle.x = 0;
      // particle.vx = Math.abs(particle.vx);
      };
      
      if (particle.x > width) {
        particle.x = width;
        // particle.vx = -Math.abs(particle.vx);
      };
      
      if (particle.y < 0) {
        particle.y = 0;
        // particle.vy = Math.abs(particle.vy);
      };
      
      if (particle.y > height) {
        particle.y = height;
        // particle.vy = -Math.abs(particle.vy);
      };

      particle.updateVelocity(this.dt);
      particle.render(this.display);
    };
  };

  render () {
    this.display.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.update();
  };
};
