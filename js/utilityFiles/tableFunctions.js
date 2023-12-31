import {database} from "./database.js";

export function createTable(informationArray,tableBody){
    for (let i = 0; i < informationArray.length; i++){
        let row = createRowForItem(informationArray[i],i)
        tableBody.appendChild(row)
        console.log(row)
    }
}

function createRowForItem(item,i) {
    const row = document.createElement("tr");
    row.appendChild(createTableCellWithText(item.nombre))
    row.appendChild(createTableCellWithText(item.telefono))
    row.appendChild(createTableCellWithText(item.empresa))
    row.appendChild(createActionTab(item,i))
    return row
}
function createTableCellWithText(text) {
    const cell = document.createElement("td");
    cell.classList.add("px-6", "py-3", "border-b", "border-gray-200", "text-left", "text-xs", "leading-4", "font-medium", "text-gray-600", "uppercase", "tracking-wider");
    cell.textContent = text;
    return cell;
}

function createActionTab(item,i){
    let cell = document.createElement("td")
    let removeButton = addRemoveButton(item,i)
    let editButton = addEditButton(item)
    cell.appendChild(removeButton)
    cell.appendChild(editButton)
    return cell
}
function addEditButton(item) {
    const button = document.createElement("button");

    button.classList.add("bg-teal-200", "px-6", "py-3", "border-b", "border-gray-200", "text-left", "text-xs", "leading-4", "font-medium", "text-gray-600", "uppercase", "tracking-wider");
    button.textContent = "Editar";
    button.addEventListener("click", async () => {
        try {
            console.log("Fetching email...");
            const email = await getById(item.email);
            console.log("Fetched email:", email);

            const id = JSON.stringify(email);
            localStorage.setItem('customerEmail', id);
            console.log("Set customerEmail in local storage:", id);

            document.dispatchEvent(new Event("innerContentReady"));
            console.log("Dispatched innerContentReady event");

        } catch (error) {
            console.error("Error fetching email:", error);
        }
    });

    button.onclick = function() {
        window.location.href = 'editar-cliente.html';
    };
    return button;
}

function addRemoveButton(item,i) {
    const button = document.createElement("button");
    button.classList.add("bg-red-200", "px-6", "py-3", "border-b", "border-gray-200", "text-left", "text-xs", "leading-4", "font-medium", "text-gray-600", "uppercase","tracking-wider");
    button.textContent = "Eliminar";
    button.id = `remove-button${i}`
    button.addEventListener("click", () =>{
        let removeButton = document.querySelector(`#remove-button${i}`);
        const transaction = database.transaction("customers", "readwrite");
        const objectStore = transaction.objectStore("customers");
        objectStore.delete(item.email).onsuccess = (event) => {
            removeButton.parentElement.parentElement.remove(removeButton.parentElement);
        };
    })
    return button;
}

function getById(id) {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction("customers", "readwrite");
        const objectStore = transaction.objectStore("customers");
        const request = objectStore.get(id);

        request.onsuccess = (event) => {
            const email = event.target.result;
            console.log("getById - Success: Fetched email for id", id, ":", email);
            resolve(email);
        };

        request.onerror = (event) => {
            console.error("getById - Error fetching email for id", id, ":", event.target.error);
            reject(event.target.error);
        };
    });
}
