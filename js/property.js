import {
    getProperties,
    updateProperty,
    getCategories
} from "./database.js";

const table = document.getElementById("propertyTable");

// ------------------------------

export function loadProperties() {

    if (!table) return;

    table.innerHTML = "";

    const properties = getProperties();

    Object.entries(properties).forEach(([id, status]) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${id}</td>

            <td>

                <select data-id="${id}">

                </select>

            </td>

        `;

        const select = row.querySelector("select");

        Object.keys(getCategories()).forEach(category => {

            const option = document.createElement("option");

            option.value = category;

            option.textContent = category;

            if (category === status) {

                option.selected = true;

            }

            select.appendChild(option);

        });

        select.onchange = () => {

            updateProperty(

                id,

                select.value

            );

        };

        table.appendChild(row);

    });

}