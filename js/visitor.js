const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");

import {
    addVisitor,
    getVisitor,
    getProperties,
    getCategories,
    checkExpiredVisitors
} from "./database.js";

// ==========================
// Elements
// ==========================

const popup = document.getElementById("popup");
const visitorForm = document.getElementById("visitorForm");

const waiting = document.getElementById("waitingScreen");

const verify = document.getElementById("verifyScreen");
const verifyBtn = document.getElementById("verifyBtn");
const verifyPhone = document.getElementById("verifyPhone");

const expired = document.getElementById("expiredScreen");

const floor = document.getElementById("floorContainer");

const timer = document.getElementById("timer");

const tooltip = document.getElementById("tooltip");

const legend = document.getElementById("legend");

// ==========================

let timerInterval;

// ==========================

function hideAll() {

    popup.style.display = "none";
    waiting.style.display = "none";
    verify.style.display = "none";
    expired.style.display = "none";
    floor.style.display = "none";
    timer.style.display = "none";

}

// ==========================
// Registration
// ==========================

visitorForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const visitor = addVisitor(
        nameInput.value.trim(),
        phoneInput.value.trim(),
        emailInput.value.trim()
    );

    localStorage.setItem(

        "currentVisitor",

        visitor.id

    );

    hideAll();

    waiting.style.display = "flex";

});

// ==========================
// Waiting
// ==========================

function checkApproval() {

    checkExpiredVisitors();

    const id = localStorage.getItem("currentVisitor");

    if (!id) {

        hideAll();

        popup.style.display = "flex";

        return;

    }

    const visitor = getVisitor(id);

    if (!visitor) {

        hideAll();

        popup.style.display = "flex";

        return;

    }

    switch (visitor.status) {

        case "Pending":

            hideAll();

            waiting.style.display = "flex";

            break;

        case "Approved":

            if (localStorage.getItem("verified")) {

                if (floor.style.display !== "block") {

                    openFloor(visitor);

                }

            } else {

                hideAll();

                verify.style.display = "flex";

            }

            break;

        case "Rejected":

            alert("Request Rejected");

            localStorage.clear();

            location.reload();

            break;

        case "Expired":

            hideAll();

            expired.style.display = "flex";

            break;

    }

}

// ==========================
// Verify
// ==========================

verifyBtn.addEventListener("click", () => {

    const id = localStorage.getItem("currentVisitor");

    const visitor = getVisitor(id);

    if (!visitor) return;

    if (verifyPhone.value.trim() != visitor.phone) {

        alert("Wrong Phone Number");

        return;

    }

    localStorage.setItem(

        "verified",

        "true"

    );

    openFloor(visitor);

});

// ==========================
// Open Floor
// ==========================

function openFloor(visitor) {

    hideAll();

    floor.style.display = "block";

    colorSVG();

    startTimer(visitor);

}

// ==========================
// Timer
// ==========================

function startTimer(visitor) {

    clearInterval(timerInterval);

    timer.style.display = "block";

    function updateTimer() {

        const left = visitor.expiresAt - Date.now();

        if (left <= 0) {

            clearInterval(timerInterval);

            localStorage.removeItem("verified");

            hideAll();

            expired.style.display = "flex";

            return;

        }

        const m = Math.floor(left / 60000);
        const s = Math.floor((left % 60000) / 1000);

        timer.textContent = `${m}:${String(s).padStart(2, "0")}`;

    }

    // Show immediately
    updateTimer();

    // Then update every second
    timerInterval = setInterval(updateTimer, 1000);

}

// ==========================
// SVG
// ==========================

function colorSVG() {

    const properties = getProperties();

    const categories = getCategories();

    legend.innerHTML = "";

    Object.entries(categories).forEach(([name, color]) => {

        const item = document.createElement("div");

        item.className = "legend-item";

        item.innerHTML =

            `<span class="legend-color"
        style="background:${color}">
        </span>${name}`;

        legend.appendChild(item);

    });

    Object.entries(properties).forEach(([id, status]) => {

        const unit = document.getElementById(id);

        if (!unit) return;

        unit.style.fill =

            categories[status];

        unit.onmousemove = (e) => {

            tooltip.style.display = "block";

            tooltip.style.left = e.clientX + 15 + "px";

            tooltip.style.top = e.clientY + 15 + "px";

            tooltip.innerHTML =

                `<b>${id}</b><br>${status}`;

        };

        unit.onmouseleave = () => {

            tooltip.style.display = "none";

        };

    });

}

// ==========================

checkApproval();

setInterval(checkApproval, 1000);
setInterval(colorSVG, 1000);