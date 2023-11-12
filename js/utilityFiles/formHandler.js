import {getObjectStore} from "./database.js";
import {activarSpinner, customerOBJ} from "./funciones.js";

export const form = document.querySelector("#formulario");
export const inputName = form.elements["nombre"];
export const inputEmail = form.elements["email"];
export const inputPhoneNumber = form.elements["telefono"];
export const inputBusiness = form.elements["empresa"];
export const submitButton = form.querySelector('button[type="submit"]');
export const spinner = document.querySelector('#spinner')

export const errorPlacement = document.querySelector("#form-parent")

// Adds information to the database
export async function addToDatabase() {
    const store = await getObjectStore();
    console.log(store)
    const request = store.add(customerOBJ);
    request.onsuccess = () => {
        activarSpinner(form, spinner)
    };

    request.onerror = () => {
        console.error('Error adding data.');
    };
}