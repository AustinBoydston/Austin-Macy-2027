const canvas = document.getElementById('fireflyCanvas');
const ctx = canvas.getContext('2d');

let fireflies = [];
const numFireflies = 30; 
let scrollY = 0;

// NEW: Track Mouse Position
let mouse = { x: -1000, y: -1000 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
});

window.addEventListener('resize', resize);
resize();

class Firefly {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; 
        this.speedX = (Math.random() - 0.5) * 0.3; 
        this.speedY = (Math.random() - 0.5) * 0.3; 
        this.opacity = Math.random();
        this.fadeSpeed = Math.random() * 0.01 + 0.005;
        this.haloRadius = this.size * 15; 
        this.parallaxFactor = this.size * 0.5; 
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around logic
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // --- NEW: Mouse Interaction Logic ---
        
        // 1. Calculate the actual visual Y (accounting for scroll/loop)
        const visualY = (( (this.y - (scrollY * this.parallaxFactor)) % canvas.height) + canvas.height) % canvas.height;
        
        // 2. Calculate distance to mouse
        const dx = this.x - mouse.x;
        const dy = visualY - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const hoverThreshold = 100; // Radius of effect in pixels

        if (distance < hoverThreshold) {
            // If near mouse: ramp up to full opacity and stay there
            if (this.opacity < 1) this.opacity += 0.05; 
            else this.opacity = 1;
        } else {
            // Normal behavior: flickering
            this.opacity += this.fadeSpeed;
            if (this.opacity > 1 || this.opacity < 0) {
                this.fadeSpeed *= -1;
            }
        }
        // Clamp opacity just in case
        this.opacity = Math.max(0, Math.min(1, this.opacity));
    }

    draw() {
        const visualY = this.y - (scrollY * this.parallaxFactor);
        const loopedY = ((visualY % canvas.height) + canvas.height) % canvas.height;

        let gradient = ctx.createRadialGradient(
            this.x, loopedY, 0, 
            this.x, loopedY, this.haloRadius
        );

        gradient.addColorStop(0, `rgba(255, 225, 100, ${this.opacity})`);
        gradient.addColorStop(0.2, `rgba(255, 215, 0, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(255, 215, 0, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, loopedY, this.haloRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, loopedY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function init() {
    fireflies = [];
    for (let i = 0; i < numFireflies; i++) {
        fireflies.push(new Firefly());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireflies.forEach(f => {
        f.update();
        f.draw();
    });
    requestAnimationFrame(animate);
}

init();
animate();