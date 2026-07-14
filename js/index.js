const categories = {
  Available: "#22c55e",
  Sold: "#ef4444",
  Reserved: "#f59e0b"
};

const tooltip = document.getElementById("tooltip");
const legend = document.getElementById("legend");

// Legend
Object.entries(categories).forEach(([name, color]) => {

  const div = document.createElement("div");

  div.className = "legend-item";

  div.innerHTML = `
        <span class="legend-color" style="background:${color}"></span>
        ${name}
    `;

  legend.appendChild(div);

});

function loadUnits() {

  let units = JSON.parse(localStorage.getItem("units")) || {

    Flat101: "Available",
    Flat102: "Sold",
    Flat103: "Reserved"

  };

  Object.entries(units).forEach(([id, status]) => {

    const unit = document.getElementById(id);

    if (!unit) return;

    unit.style.fill = categories[status];

    unit.onmousemove = (e) => {

      tooltip.style.display = "block";

      tooltip.style.left = e.clientX + 15 + "px";

      tooltip.style.top = e.clientY + 15 + "px";

      tooltip.innerHTML = `
                <strong>${id}</strong><br>
                ${status}
            `;

    };

    unit.onmouseleave = () => {

      tooltip.style.display = "none";

    };

  });

}

// Initial load
loadUnits();

// Detect changes from admin page
window.addEventListener("storage", loadUnits);

// Refresh every second (helps during Live Server testing)
setInterval(loadUnits, 1000);