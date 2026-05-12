/* ---------------- SUBMIT CUSTOM ORDER ---------------- */
document.getElementById("submitCustomOrder").addEventListener("click", async () => {
  const name   = document.getElementById("customName").value.trim();
  const email  = document.getElementById("customEmail").value.trim();
  const type   = document.getElementById("customType").value;
  const qty    = document.getElementById("customQty").value.trim();
  const color  = document.getElementById("customColor").value.trim();
  const budget = document.getElementById("customBudget").value.trim();
  const notes  = document.getElementById("customNotes").value.trim();

  if (!name || !email || !type || !qty) {
    alert("Please fill in your name, email, product type, and quantity.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("customerName", name);
  formData.append("customerEmail", email);
  formData.append("productType", type);
  formData.append("quantity", qty);
  formData.append("color", color);
  formData.append("budget", budget);
  formData.append("notes", notes);

  const res = await fetch(`${API}/custom-orders`, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const text = await res.text();

  if (res.ok) {
    // Show confirmation modal with summary
    document.getElementById("order-summary").innerHTML = `
      <strong>Name:</strong> ${name}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Type:</strong> ${type}<br>
      <strong>Quantity:</strong> ${qty}<br>
      ${color ? `<strong>Color/Glaze:</strong> ${color}<br>` : ""}
      ${budget ? `<strong>Budget:</strong> ${budget}<br>` : ""}
      ${notes ? `<strong>Notes:</strong> ${notes}` : ""}
    `;
    new bootstrap.Modal(document.getElementById("confirmModal")).show();

    // Clear form
    document.getElementById("customName").value = "";
    document.getElementById("customEmail").value = "";
    document.getElementById("customType").value = "";
    document.getElementById("customQty").value = "";
    document.getElementById("customColor").value = "";
    document.getElementById("customBudget").value = "";
    document.getElementById("customNotes").value = "";

    loadPastOrders();
  } else {
    alert("Error: " + text);
  }
});

/* ---------------- LOAD PAST CUSTOM ORDERS ---------------- */
async function loadPastOrders() {
  try {
    const res = await fetch(`${API}/custom-orders`, { credentials: "include" });
    const data = await res.json();
    const grid = document.getElementById("customOrdersGrid");
    grid.innerHTML = "";

    if (data.length === 0) {
      grid.innerHTML = `<p class="google-sans-font text-center" style="color:#7A6A60;">No custom orders yet.</p>`;
      return;
    }

    data.forEach(order => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="past-work-card">
          <div class="past-work-body">
            <div class="past-work-type">${order.productType}</div>
            <div class="past-work-name">${order.customerName}</div>
            <div class="past-work-desc">
              ${order.color ? `Color: ${order.color}<br>` : ""}
              ${order.notes ? order.notes : "No additional notes."}
            </div>
          </div>
        </div>
      `;
      grid.appendChild(col);
    });
  } catch (e) {
    console.error("Failed to load past orders", e);
  }
}

loadPastOrders();