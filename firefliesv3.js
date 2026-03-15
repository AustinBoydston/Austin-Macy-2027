const canvas = document.getElementById('fireflyCanvas');
const ctx = canvas.getContext('2d');

let fireflies = [];
const numFireflies = 70; // Slightly increased for a better "swarm" effect
let scrollY = 0;

// Track Mouse Position
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
        this.speedX = (Math.random() - 0.5) * 0.4; 
        this.speedY = (Math.random() - 0.5) * 0.4; 
        this.opacity = Math.random();
        this.fadeSpeed = Math.random() * 0.01 + 0.005;
        this.haloRadius = this.size * 15; 
        this.parallaxFactor = this.size * 0.5; 
    }

    update() {
        // 1. Calculate visual Y (where the dot actually appears on screen)
        const visualY = (((this.y - (scrollY * this.parallaxFactor)) % canvas.height) + canvas.height) % canvas.height;

        // 2. Interaction Math
        const dx = this.x - mouse.x;
        const dy = visualY - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceRadius = 130; // Radius of mouse influence

        if (distance < forceRadius) {
            // GLOW: Ramp up to full brightness
            if (this.opacity < 1) this.opacity += 0.07;
            
            // FLEE: Calculate angle and push force
            const angle = Math.atan2(dy, dx);
            const force = (forceRadius - distance) / forceRadius;
            const pushSpeed = 2.5;

            // Apply the push to the actual coordinates
            this.x += Math.cos(angle) * pushSpeed * force;
            this.y += Math.sin(angle) * pushSpeed * force;
        } else {
            // WANDER: Normal slow movement
            this.x += this.speedX;
            this.y += this.speedY;

            // FLICKER: Normal slow pulse
            this.opacity += this.fadeSpeed;
            if (this.opacity > 1 || this.opacity < 0) {
                this.fadeSpeed *= -1;
            }
        }

        // 3. Screen Wrap Logic
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Prevent opacity from going out of bounds [0, 1]
        this.opacity = Math.max(0, Math.min(1, this.opacity));
    }

    draw() {
        const visualY = this.y - (scrollY * this.parallaxFactor);
        const loopedY = ((visualY % canvas.height) + canvas.height) % canvas.height;

        // Draw Glow Halo
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

        // Draw Core Dot
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
    // Semi-transparent clear creates a very faint trail effect if desired,
    // but standard clearRect is cleaner for high-performance glows.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    fireflies.forEach(f => {
        f.update();
        f.draw();
    });
    requestAnimationFrame(animate);
}

init();
animate();