const canvas = document.createElement("canvas");
document.getElementById("network-background").appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const maxParticles = 100; // Max number of particles

// Particle Constructor
function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.size = Math.random() * 3 + 1;
  this.speedX = Math.random() * 0.5 - 0.25;
  this.speedY = Math.random() * 0.5 - 0.25;
}

Particle.prototype.update = function() {
  this.x += this.speedX;
  this.y += this.speedY;
  if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
  if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
};

Particle.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fill();
};

function createParticles() {
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    
    // Draw lines between close particles
    for (let i = index + 1; i < particles.length; i++) {
      const dist = Math.hypot(particle.x - particles[i].x, particle.y - particles[i].y);
      if (dist < 100) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particles[i].x, particles[i].y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animateParticles);
}

createParticles();
animateParticles();

// Resize canvas on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
