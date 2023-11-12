import {activarSpinner, customerOBJ, displayAlert} from "./funciones.js";
import {errorPlacement, form, inputBusiness, inputEmail, inputName, inputPhoneNumber, spinner} from "./formHandler.js";

function updatedDataWithSameIdSuccess() {
    setInterval(function () {
        activarSpinner(form, spinner)
    }, 6000)
    console.log('Data updated successfully');
    window.location.href = 'index.html';
}

function setNewUserDataSameId() {
    customerOBJ.nombre = inputName.value.trim();
    customerOBJ.telefono = inputPhoneNumber.value.trim();
    customerOBJ.empresa = inputBusiness.value.trim();
}
// Define a function to update customer data with the same email ID.
export function updateCustomerSameId(objectStore) {
    setNewUserDataSameId();
    const updateRequest = objectStore.put(customerOBJ);
    updateRequest.onsuccess = function () {
        updatedDataWithSameIdSuccess();
    };
    updateRequest.onerror = function (){
        throw Error("Failed adding new user with same id")
    }
}

function handleIfEmailIsAlreadyInDB(customerId,customerData, objectStore) {
    const cursorRequest = objectStore.openCursor();

    cursorRequest.onsuccess = async function (event) {
        const cursor = event.target.result;

        if (cursor) {
            if (cursor.value.email === customerData.email) {
                updateCustomerSameId(objectStore)
            }
            if (customerData === customerId) {
                displayAlert("Email already in use. Please choose a different email.", errorPlacement);
            } else {
                await updateCustomerDiferentId(objectStore);
            }
        }
    }
}
export function saveDatabaseDifferentEmail(objectStore, customerId, customerData) {
    return new Promise((resolve, reject) => {
        const request = objectStore.get(customerData.email);
        request.onsuccess = async function () {
            await handleIfEmailIsAlreadyInDB(customerId, customerData.email, objectStore);
            resolve();
        };

        request.onerror = function (event) {
            reject(new Error("Error retrieving customer: " + event.target.error));
        };
    });
}


// Define a function to update customer data with a different email ID.
export async function updateCustomerDiferentId(objectStore) {
    const deleteRequest = await objectStore.delete(customerOBJ.email);
    deleteRequest.onsuccess = async function () {
        await setNewValuesToAdd();
        console.log(objectStore)
        await addNewCustomerWithDiferentId(objectStore);
    }
    deleteRequest.onerror = function () {
        throw Error("Deleting old user failed ")
    }
}
async function addNewCustomerWithDiferentId(objectStore) {
    console.log(objectStore);

    try {
        const updatedRequest = await objectStore.put(customerOBJ);
        console.log(updatedRequest);

        // When the transaction is complete, redirect to 'index.html'.
        updatedRequest.onsuccess = function () {
            console.log("Put operation successful");
            window.location.href = 'index.html';
        };

        updatedRequest.onerror = function (event) {
            console.error("Failed to upload data to database ", event.target.error);
            // Additional handling or debugging steps if needed
            throw Error("Failed to upload data to database ");
        }
    } catch (error) {
        console.error("Error during put operation:", error);
    }
}


function setNewValuesToAdd() {
    customerOBJ.email = inputEmail.value.trim();
    customerOBJ.nombre = inputName.value.trim();
    customerOBJ.telefono = inputPhoneNumber.value.trim();
    customerOBJ.empresa = inputBusiness.value.trim();
}

export function getInfoSuccess(event) {
    const item = event.target.result;
    if (item) {
        console.log(item.email);
    } else {
        console.log("Item not found.");
    }
    setFormInfo(item)
}

// Define a function to set form information based on existing customer data.
function setFormInfo(item) {
    inputName.value = item.nombre;
    inputEmail.value = item.email;
    inputPhoneNumber.value = item.telefono;
    inputBusiness.value = item.empresa;
}