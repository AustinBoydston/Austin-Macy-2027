function updateCountdown() {
    const targetDate = new Date("June 6, 2027 00:00:00").getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    // Math: ms / (ms * sec * min * hr)
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    // Display the result in the element with id="days-left"
    if (difference > 0) {
        document.getElementById("days-left").innerText = days;
    } else {
        document.getElementById("days-left").innerText = "The day has arrived!";
    }
}

// Run the function immediately
updateCountdown();

// Update it every 24 hours (or every second if you want to add hours/mins later)
setInterval(updateCountdown, 1000);