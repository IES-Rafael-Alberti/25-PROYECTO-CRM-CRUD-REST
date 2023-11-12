import { validar} from "./utilityFiles/funciones.js";
import { inputName, inputBusiness, inputEmail, inputPhoneNumber, submitButton} from "./utilityFiles/formHandler.js"
import {createDatabase, getObjectStore} from "./utilityFiles/database.js";
import {
    saveDatabaseDifferentEmail,
    updateCustomerSameId
} from "./utilityFiles/editingFunctions.js";

document.addEventListener("DOMContentLoaded", () => {
    
    const customerDataString = localStorage.getItem('customerEmail');
    const customerData = JSON.parse(customerDataString);
    console.log("Customer Email:", customerData);
    let database;

    document.addEventListener("innerContentReady", async () => {
        try {
            database = await createDatabase();
            const objectStore = await  getObjectStore(database);
            await getCustomerData(objectStore);


        } catch (error) {
            console.error("Error creating database or getting customer data:", error);
        }
    });

    document.dispatchEvent(new Event("innerContentReady"));
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
    submitButton.addEventListener("click", (e) =>{
        e.preventDefault()
        saveToDatabase().then(r => console.log("good") )
    });

    async function getCustomerData(objectStore) {
        return new Promise((resolve, reject) => {

            const getInformationRequest = objectStore.get(customerData.email);

            getInformationRequest.onsuccess = (event) => {
                const result = event.target.result;
                resolve(result);
            };

            getInformationRequest.onerror = (event) => {
                reject(new Error("Error getting item:", event.target.error));
            };
        });
    }

// Function to save data to the database.js.
    async function saveToDatabase() {
        try {
            // Use await to ensure createDatabase completes before moving forward
            const transaction = database.transaction("customers", "readwrite");
            const objectStore = transaction.objectStore("customers");
            if (customerData.email !== inputEmail.value.trim()) {
                let email = inputEmail.value
                await saveDatabaseDifferentEmail(objectStore,email,customerData);
            } else {
                // If the email hasn't changed, update the data with the same email.
                debugger
                await updateCustomerSameId(objectStore);
            }
        } catch (error) {
            console.error("Error saving to database:", error);
        }
    }
})