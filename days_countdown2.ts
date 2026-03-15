function startTimer() {
    const target = new Date("June 6, 2027 00:00:00").getTime();

    const timer = setInterval(function() {
        const now = new Date().getTime();
        const diff = target - now;

        if (diff <= 0) {
            clearInterval(timer);
            document.getElementById("countdown").innerHTML = "<h2>The Big Day is Here!</h2>";
            return;
        }

        // Calculations using basic math constants
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        // Updating the HTML
        document.getElementById("days").innerText = d;
        document.getElementById("hours").innerText = h;
        document.getElementById("minutes").innerText = m;
        document.getElementById("seconds").innerText = s;

    }, 1000); // This runs every 1000ms (1 second)
}

startTimer();