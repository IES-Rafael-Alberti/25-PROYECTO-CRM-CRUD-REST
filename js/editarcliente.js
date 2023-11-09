import {activarSpinner, customerOBJ, displayAlert, validar} from "./funciones.js";
import {form, inputName, inputBusiness, inputEmail, inputPhoneNumber, submitButton, spinner} from "./formHandler.js"
document.addEventListener("DOMContentLoaded", () => {

    // Open or create a database named "MyDatabase" with version 3.
    const openRequest = indexedDB.open("MyDatabase", 3);
    //TODO Refactor the database code

    // Retrieve the customer's email from local storage.
    const customerEmailString = localStorage.getItem('customerEmail');
    const customerEmail = JSON.parse(customerEmailString);
    let database;


    openRequest.onsuccess = (event) => {
        database = event.target.result;
        const transaction = database.transaction("customers", "readwrite");
        const objectStore = transaction.objectStore("customers");

        // Get the customer data using the provided email.
        const getInformationRequest = objectStore.get(customerEmail);
        getInformationRequest.onsuccess = (event) => {
            const item = event.target.result;
            if (item) {
                console.log(item.email);
            } else {
                console.log("Item not found.");
            }
            setFormInfo(item)
        };

        getInformationRequest.onerror = (event) => {
            console.error("Error getting item:", event.target.error);
        };
    }

    // Define a function to set form information based on existing customer data.
    function setFormInfo(item) {
        inputName.value = item.nombre;
        inputEmail.value = item.email;
        inputPhoneNumber.value = item.telefono;
        inputBusiness.value = item.empresa;
    }

    // Handle the "blur" event for input fields by calling the "validar" function.
    inputName.addEventListener("blur", (event)=>{
        validar(event,submitButton)
    });
    inputEmail.addEventListener("blur", (event)=>{
        validar(event,submitButton)
    });
    inputPhoneNumber.addEventListener("blur", (event)=>{
        validar(event,submitButton)
    });
    inputBusiness.addEventListener("blur", (event)=>{
        validar(event,submitButton)
    });

    // Handle the "click" event for the submit button by calling the "saveToDatabase" function.
    submitButton.addEventListener("click", saveToDatabase);

    // Define a function to update customer data with a different email ID.
    function updateCustomerDiferentId(objectStore, transaction) {
        // Delete the old data with the previous email.
        const deleteRequest = objectStore.delete(customerOBJ.email);

        // Update the customer object with new data.
        customerOBJ.email = inputEmail.value.trim();
        customerOBJ.nombre = inputName.value.trim();
        customerOBJ.telefono = inputPhoneNumber.value.trim();
        customerOBJ.empresa = inputBusiness.value.trim();

        // Put the updated data in the object store.
        objectStore.put(customerOBJ);

        // When the transaction is complete, redirect to 'index.html'.
        transaction.oncomplete = function () {
            console.log('Data updated successfully');
            window.location.href = 'index.html';
        };
    }

    // Define a function to update customer data with the same email ID.
    function updatadeCustomerSameId(objectStore, transaction) {
        // Update the customer object with new data.
        customerOBJ.nombre = inputName.value.trim();
        customerOBJ.telefono = inputPhoneNumber.value.trim();
        customerOBJ.empresa = inputBusiness.value.trim();

        // Put the updated data in the object store.
        objectStore.put(customerOBJ);

        // When the transaction is complete, redirect to 'index.html'.
        transaction.oncomplete = function () {
            setInterval(function() {
                activarSpinner(form,spinner)
            },6000)
            console.log('Data updated successfully');
            window.location.href = 'index.html';
        };
    }

    // Function to save data to the database.
    function saveToDatabase() {
        // Start a transaction for the "customers" object store.
        const transaction = database.transaction("customers", "readwrite");
        const objectStore = transaction.objectStore("customers");

        // Check if the email has changed.
        if (customerOBJ.email !== inputEmail.value.trim()) {
            // If the email has changed, check if it already exists in the database.
            const request = objectStore.get(inputEmail.value.trim());

            request.onsuccess = (event) => {
                const existingCustomer = event.target.result;
                if (existingCustomer) {
                    displayAlert("Email already in use. Please choose a different email.", inputEmail.value);
                } else {
                    updateCustomerDiferentId(objectStore, transaction);
                }
            };
        } else {
            // If the email hasn't changed, update the data with the same email.
            updatadeCustomerSameId(objectStore, transaction);
        }
    }
})