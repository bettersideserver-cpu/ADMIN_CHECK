import {
    getProperties,
    updateProperty,
    getCategories
} from "./database.js";

const table = document.getElementById("propertyTable");

// ------------------------------

export async function loadProperties() {

    if (!table) return;

    table.innerHTML = "";

    const properties = await getProperties();

   for (const [id, status] of Object.entries(properties)) {

    const row = document.createElement("tr");

    row.innerHTML = `

        <td>${id}</td>

        <td>

            <select data-id="${id}"></select>

        </td>

    `;

    const select = row.querySelector("select");

    const categories = await getCategories();

    Object.keys(categories).forEach(category => {

        const option = document.createElement("option");

        option.value = category;

        option.textContent = category;

        if (category === status) {
            option.selected = true;
        }

        select.appendChild(option);

    });

    select.onchange = async () => {

        await updateProperty(id, select.value);

    };

    table.appendChild(row);

}

}
