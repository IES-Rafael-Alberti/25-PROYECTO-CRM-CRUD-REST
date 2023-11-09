import { activarSpinner,customerOBJ,validar} from "./funciones.js";
import { form, inputName,inputBusiness,inputEmail,inputPhoneNumber,spinner } from "./formHandler.js"

document.addEventListener("DOMContentLoaded", async () => {

    //TODO Refactor the database code

    // Constants and variables
    const openRequest = await indexedDB.open("MyDatabase", 3);
    let database;

    // Listeners
    inputName.addEventListener("blur", validar)
    inputEmail.addEventListener("blur", validar)
    inputPhoneNumber.addEventListener("blur", validar)
    inputBusiness.addEventListener("blur", validar)

    openRequest.onupgradeneeded = function (event) {
        database = event.target.result; // Assign the database reference to the global db variable
        let objectStore = database.createObjectStore("customers", {keyPath: "email"});
        objectStore.createIndex("nombre", "nombre", {unique: false});
        objectStore.createIndex("email", "email", {unique: true});
        objectStore.createIndex("telefono", "telefono", {unique: true});
        objectStore.createIndex("empresa", "empresa", {unique: false});
        console.log("Database opened successfully.");
    };

    openRequest.onsuccess = function (event) {
        database = event.target.result; // Assign the database reference to the global db variable
    };

    openRequest.onerror = function (event) {
        console.error("Error opening database:", event.target.error);
    };

    // Handling form submission

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (inputEmail.value.trim() === "") {
            console.error("Email is required.");
            return;
        }
        const transaction = database.transaction(['customers'], 'readwrite');
        const store = transaction.objectStore('customers');
        const request = store.add(customerOBJ);
        request.onsuccess = () => {
            activarSpinner(form, spinner)
        };

        request.onerror = () => {
            console.error('Error adding data.');
        };
    });
})
