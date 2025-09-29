// Login/Signup Modal Logic
let isLogin = true;

function openAuth() {
  document.getElementById("authModal").classList.remove("hidden");
  document.body.style.overflow = "hidden"; // prevent background scroll
  setAuthMode(true);
}

function closeAuth() {
  document.getElementById("authModal").classList.add("hidden");
  document.body.style.overflow = "auto"; // restore scroll
}

function toggleAuth() {
  isLogin = !isLogin;
  setAuthMode(isLogin);
}

function setAuthMode(login) {
  document.getElementById("authTitle").textContent = login ? "Login" : "Sign Up";
  document.getElementById("nameField").classList.toggle("hidden", login);
  document.getElementById("toggleText").textContent = login ? "Don't have an account?" : "Already have an account?";
  document.getElementById("toggleBtn").textContent = login ? "Sign Up" : "Login";
}

// Close modal on clicking outside
window.addEventListener("click", (e) => {
  const modal = document.getElementById("authModal");
  if (!modal.classList.contains("hidden") && e.target === modal) {
    closeAuth();
  }
});

// Close modal on pressing ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !document.getElementById("authModal").classList.contains("hidden")) {
    closeAuth();
  }
});

// Mobile Menu Toggle
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("hidden");
}

// ===== Typewriter Effect for Hero Text =====
const texts = ["Learn to Code", "Build Projects", "Master Algorithms", "Join Hackathons"];
let currentText = 0;
let currentChar = 0;
const typingSpeed = 100; // ms per character
const erasingSpeed = 50;
const delayBetweenTexts = 2000;
const changingTextEl = document.getElementById("changing-text");

function typeWriter() {
  if (currentChar < texts[currentText].length) {
    changingTextEl.textContent += texts[currentText].charAt(currentChar);
    currentChar++;
    setTimeout(typeWriter, typingSpeed);
  } else {
    setTimeout(eraseText, delayBetweenTexts);
  }
}

function eraseText() {
  if (currentChar > 0) {
    changingTextEl.textContent = texts[currentText].substring(0, currentChar - 1);
    currentChar--;
    setTimeout(eraseText, erasingSpeed);
  } else {
    currentText = (currentText + 1) % texts.length;
    setTimeout(typeWriter, typingSpeed);
  }
}

// Start the typewriter effect
document.addEventListener("DOMContentLoaded", () => {
  typeWriter();
});
