function toggleNav() {
  var nav = document.getElementById("myTopNav");
  nav.classList.toggle("responsive");
}

// Close menu when clicking anywhere outside the navbar
document.addEventListener('click', function(e) {
  const nav = document.getElementById("myTopNav");
  
  // Only close if menu is currently open AND click happened outside the navbar
  if (nav.classList.contains('responsive') && !nav.contains(e.target)) {
    nav.classList.remove('responsive');
  }
});


// Close menu when any nav link is clicked
document.querySelectorAll('.navbar.responsive a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById("myTopNav").classList.remove('responsive');
  });
});

// Optional but recommended: Close menu when resizing back to desktop size
window.addEventListener('resize', function() {
  const nav = document.getElementById("myTopNav");
  if (nav.classList.contains('responsive') && window.innerWidth > 770) {
    nav.classList.remove('responsive');
  }
});
