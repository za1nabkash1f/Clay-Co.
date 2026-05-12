const API = "http://localhost:8080/ClayAndCo_New/api";

/* ---------- CHECK SESSION ON PAGE LOAD ---------- */
async function checkSession() {
  try {
    const res = await fetch(`${API}/auth`, { credentials: "include" });
    const text = await res.text();

    if (text.startsWith("role:admin")) {
      setAdminUI(true, "admin");
    } else if (text.startsWith("role:")) {
      setAdminUI(false, "user");
    } else {
      setAdminUI(false, null);
    }
  } catch (e) {
    console.error("Session check failed", e);
  }
}

/* ---------- SHOW/HIDE UI BASED ON ROLE ---------- */
function setAdminUI(isAdmin, role) {
  // Hide sign in button if logged in
  const signInBtn = document.querySelector(".btn[data-bs-target='#signInModal']");
  if (role !== null && signInBtn) {
    signInBtn.textContent = "SIGN OUT";
    signInBtn.removeAttribute("data-bs-toggle");
    signInBtn.removeAttribute("data-bs-target");
    signInBtn.addEventListener("click", signOut);
  }

  // Show admin button only for admins
  const adminBtn = document.getElementById("admin");
  if (adminBtn) {
    adminBtn.style.display = isAdmin ? "inline-block" : "none";
  }
}

/* ---------- SIGN IN ---------- */
document.getElementById("signInBtn")?.addEventListener("click", async () => {
  const email    = document.getElementById("signInEmail").value.trim();
  const password = document.getElementById("signInPassword").value.trim();

  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("action", "login");
  formData.append("email", email);
  formData.append("password", password);

  const res = await fetch(`${API}/auth`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const text = await res.text();

  if (text.startsWith("Login successful:admin")) {
    bootstrap.Modal.getInstance(document.getElementById("signInModal")).hide();
    setAdminUI(true, "admin");
    alert("Welcome, Admin!");
  } else if (text.startsWith("Login successful:")) {
    bootstrap.Modal.getInstance(document.getElementById("signInModal")).hide();
    setAdminUI(false, "user");
    alert("Signed in successfully!");
  } else {
    alert("Invalid credentials. Please try again.");
  }
});

/* ---------- SIGN OUT ---------- */
async function signOut() {
  await fetch(`${API}/auth`, {
    method: "POST",
    credentials: "include",
    body: new URLSearchParams({ action: "logout" })
  });

  location.reload();
}

/* ---------- RUN ON LOAD ---------- */
checkSession();/**
 * 
 */