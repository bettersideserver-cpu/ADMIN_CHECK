const selects = document.querySelectorAll("select");

// Default data
let units = JSON.parse(localStorage.getItem("units")) || {
    Flat101: "Available",
    Flat102: "Sold",
    Flat103: "Reserved"
};

// Set dropdown values
selects.forEach(select => {

    const flat = select.dataset.flat;

    if (units[flat]) {
        select.value = units[flat];
    }

});

// Save changes
selects.forEach(select => {

    select.addEventListener("change", () => {

        const flat = select.dataset.flat;

        units[flat] = select.value;

        localStorage.setItem("units", JSON.stringify(units));

        console.log("Saved");

    });

});