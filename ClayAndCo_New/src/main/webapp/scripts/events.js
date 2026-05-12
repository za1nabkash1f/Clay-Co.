
/* ---------------- GLOBAL EVENTS OBJECT ---------------- */
let events = {};

/* ---------------- LOAD EVENTS FROM DATABASE ---------------- */
async function loadEvents() {
  const res = await fetch(`${API}/events`, { credentials: "include" });
  const data = await res.json();

  events = {};

  data.forEach(e => {
    if (!events[e.dayOfMonth]) {
      events[e.dayOfMonth] = [];
    }
    events[e.dayOfMonth].push({
      id:   e.id,
      name: e.name,
      desc: e.description
    });
  });

  buildCalendar(now.getFullYear(), now.getMonth());
}

/* ---------------- DELETE EVENT ---------------- */
async function deleteEvent(eventId) {
  if (!confirm("Are you sure you want to delete this event?")) return;

  const res = await fetch(`${API}/events?id=${eventId}`, {
    method: "DELETE",
    credentials: "include"
  });

  const text = await res.text();
  alert(text);
  loadEvents();
}

/* ---------------- MODAL ---------------- */
function showModal(name, desc) {
  document.getElementById("modalEventName").textContent = name;
  document.getElementById("modalEventDesc").textContent = desc || "No description provided.";

  const modalEl = document.getElementById("eventModal");
  const existing = bootstrap.Modal.getInstance(modalEl);
  if (existing) existing.dispose();

  new bootstrap.Modal(modalEl).show();
}

/* ---------------- CALENDAR ---------------- */
function buildCalendar(year, month) {
  const monthNames = ["January","February","March","April","May","June",
                      "July","August","September","October","November","December"];

  document.getElementById("calendar-title").textContent = `${monthNames[month]} ${year}`;

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tbody = document.getElementById("calendar-body");
  tbody.innerHTML = "";

  // check if admin is visible (meaning admin is logged in)
  const isAdmin = document.getElementById("admin").style.display !== "none";

  let day = 1;
  let row = document.createElement("tr");

  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement("td"));
  }

  while (day <= daysInMonth) {
    if (row.children.length === 7) {
      tbody.appendChild(row);
      row = document.createElement("tr");
    }

    const td = document.createElement("td");
    td.innerHTML = day;

    if (events[day]) {
      const dayEvents = events[day];
      td.classList.add("table-info");

      dayEvents.forEach((evt, i) => {
        // event name link
        td.innerHTML += `<br><small class="event-link" data-index="${i}">${evt.name}</small>`;

        // delete button only visible to admin
        if (isAdmin) {
          td.innerHTML += ` <small class="delete-event-btn" data-id="${evt.id}" 
            style="color:red; cursor:pointer; font-weight:bold;">✕</small>`;
        }
      });

      td.style.cursor = "pointer";

      td.addEventListener("click", () => {
        showModal(dayEvents[0].name, dayEvents[0].desc);
      });

      setTimeout(() => {
        // event name clicks
        td.querySelectorAll(".event-link").forEach(tag => {
          tag.addEventListener("click", (e) => {
            e.stopPropagation();
            const index = tag.getAttribute("data-index");
            showModal(dayEvents[index].name, dayEvents[index].desc);
          });
        });

        // delete button clicks
        td.querySelectorAll(".delete-event-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.getAttribute("data-id");
            deleteEvent(id);
          });
        });
      }, 0);
    }

    row.appendChild(td);
    day++;
  }

  while (row.children.length < 7) {
    row.appendChild(document.createElement("td"));
  }

  tbody.appendChild(row);
}

/* ---------------- ADMIN BUTTON ---------------- */
document.getElementById("admin").addEventListener("click", () => {
  document.getElementById("input-form").style.display = "block";
});

/* ---------------- CREATE EVENT ---------------- */
document.getElementById("formSubmit").addEventListener("click", async () => {
  const name = document.getElementById("eventName").value.trim();
  const day  = parseInt(document.getElementById("eventDay").value);
  const desc = document.getElementById("eventDesc").value.trim();

  if (!name) { alert("Please enter an event name."); return; }
  if (!day || day < 1 || day > 31) { alert("Please enter a valid day."); return; }

  const formData = new URLSearchParams();
  formData.append("eventName", name);
  formData.append("eventDay",  day);
  formData.append("eventDesc", desc);

  const res = await fetch(`${API}/events`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const text = await res.text();
  alert(text);

  document.getElementById("eventName").value = "";
  document.getElementById("eventDay").value  = "";
  document.getElementById("eventDesc").value = "";
  document.getElementById("input-form").style.display = "none";

  loadEvents();
});

/* ---------------- INIT ---------------- */
const now = new Date();
loadEvents();