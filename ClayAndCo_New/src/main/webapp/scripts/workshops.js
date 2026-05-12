
/* ---------------- IMAGE RANDOMIZER ---------------- */
const images = [
  "images/workshop2.jpg",
  "images/workshop3.jpg",
  "images/workshop4.jpg",
  "images/workshop5.jpg"
];

function getRandomImage() {
  return images[Math.floor(Math.random() * images.length)];
}

/* ---------------- LOAD WORKSHOPS FROM DATABASE ---------------- */
async function loadWorkshops() {
  const res = await fetch(`${API}/workshops`, { credentials: "include" });
  const data = await res.json();

  document.querySelectorAll(".dynamic-card").forEach(el => el.remove());

  data.forEach(w => {
    const card = document.createElement("div");
    card.classList.add("container-fluid", "py-4", "dynamic-card");

    card.innerHTML = `
      <div class="workshop-card" data-id="${w.id}">
        <img src="${w.image || getRandomImage()}" class="workshop-img">
        <div class="workshop-body">
          <div class="row g-2 align-items-center mb-3">
            <div class="col-auto">
              <span class="tag">${w.level.toUpperCase()}</span>
            </div>
            <div class="col-auto card-details">
              <i class="fa-solid fa-calendar"></i> ${w.date}
            </div>
            <div class="col-auto card-details">
              <i class="fa-solid fa-clock"></i> ${w.duration} Hours
            </div>
            <div class="col-auto card-details">
              <i class="fa-solid fa-user"></i>
              <span class="spots-count">${w.availableSpots}</span> Spots Left
            </div>
          </div>
          <h2 class="workshop-title">${w.name}</h2>
          <p class="workshop-desc">${w.description}</p>
          <div class="workshop-footer">
            <span class="workshop-price">$${w.price}</span>
            <button class="book-button" data-id="${w.id}" data-bs-toggle="modal" data-bs-target="#bookingModal">
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("wrkshp").appendChild(card);
  });
}


/* ---------------- ADMIN BUTTON — SHOW FORM ---------------- */
document.getElementById("admin").addEventListener("click", () => {
  document.getElementById("input-form").style.display = "block";
});

/* ---------------- CREATE WORKSHOP ---------------- */
document.getElementById("formSubmit").addEventListener("click", async (event) => {
  event.preventDefault();

  const name     = document.getElementById("workshopName").value.trim();
  const date     = document.getElementById("workshopDate").value.trim();
  const duration = document.getElementById("workshopDuration").value.trim();
  const spots    = document.getElementById("availableSpots").value.trim();
  const desc     = document.getElementById("workshopDesc").value.trim();
  const price    = document.getElementById("workshopPrice").value.trim();
  const level    = document.querySelector('input[name="level"]:checked')?.value;

  if (!name || !date || !duration || !spots || !desc || !price || !level) {
    alert("Please fill in all fields and select a level before submitting.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("workshopName", name);
  formData.append("workshopDate", date);
  formData.append("workshopDuration", duration);
  formData.append("availableSpots", spots);
  formData.append("workshopDesc", desc);
  formData.append("workshopPrice", price);
  formData.append("level", level);
  formData.append("image", getRandomImage());

  const res = await fetch(`${API}/workshops`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const text = await res.text();
  alert(text);

  // Clear form
  document.getElementById("workshopName").value = "";
  document.getElementById("workshopDate").value = "";
  document.getElementById("workshopDuration").value = "";
  document.getElementById("availableSpots").value = "";
  document.getElementById("workshopDesc").value = "";
  document.getElementById("workshopPrice").value = "";
  document.querySelectorAll('input[name="level"]').forEach(r => r.checked = false);
  document.getElementById("input-form").style.display = "none";

  loadWorkshops();
});

/* ---------------- BOOKING SYSTEM ---------------- */
let selectedWorkshopId = null;

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("book-button")) {
    selectedWorkshopId = e.target.getAttribute("data-id");
  }
});

document.getElementById("confirmationButton").addEventListener("click", async () => {
  const fullName = document.getElementById("bookingName").value.trim();
  const email    = document.getElementById("bookingEmail").value.trim();
  const spots    = document.getElementById("numberOfSpots").value.trim();

  if (!fullName || !email || !spots) {
    alert("Please fill in all fields before confirming.");
    return;
  }

  if (!selectedWorkshopId) {
    alert("No workshop selected. Please try again.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("workshopId", selectedWorkshopId);
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("spots", spots);

  const res = await fetch(`${API}/bookings`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const text = await res.text();
  alert(text);

  const modal = bootstrap.Modal.getInstance(document.getElementById("bookingModal"));
  if (modal) modal.hide();

  document.getElementById("bookingName").value = "";
  document.getElementById("bookingEmail").value = "";
  document.getElementById("numberOfSpots").value = "";
  selectedWorkshopId = null;

  loadWorkshops();
});

/* ---------------- INIT ---------------- */
loadWorkshops();
checkSession();