let isLogin = true;

function openAuth() {
  document.getElementById("authModal").classList.remove("hidden");
  setAuthMode(true); // open in Login mode
}

function closeAuth() {
  document.getElementById("authModal").classList.add("hidden");
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
