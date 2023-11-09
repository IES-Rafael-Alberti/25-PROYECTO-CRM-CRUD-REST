import {submitButton} from "./formHandler.js";

export const customerOBJ = {
    email: "",
    nombre: "",
    telefono: "",
    empresa: ""
}
let database;

// Validating Functions

  function validateName(name){
    let regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
    return regex.test(name)
}

 function validateEmail(email){
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    return regex.test(email)
}

function validatePhoneNumber(phoneNumber)   {
    let regex = /^(?:\+\d{1,3}\s?)?(\d{9,10})$/

    return regex.test(phoneNumber)
}
 // Summit button handler

 export function validateCustomer() {
     const values = Object.values(customerOBJ)
     if (values.includes("")){
         console.log("aaaaaaaa" + submitButton)
         submitButton.classList.add("opacity-50")

         console.log(submitButton)
         submitButton.disabled = true
         return
     }
     submitButton.classList.remove("opacity-50")
     submitButton.disabled = false
 }

// Function to clear any existing alerts.
function clearAlert(referencia) {
    const alerta = referencia.querySelector(".bg-red-600");
    if (alerta) {
        alerta.remove();
    }
}

// Function to display an alert message.
export function displayAlert(mensaje, referencia) {
    clearAlert(referencia);
    const error = document.createElement("P");
    error.textContent = mensaje;
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2");
    referencia.appendChild(error);
}

 // Function to validate input fields.
 export function validar(e) {
     if (e.target.value.trim() === "") {
         displayAlert(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);
         validateCustomer();
         return;
     }

     if ((!validateName(e.target.value.trim()) && (e.target.id === "nombre" || e.target.id === "empresa"))) {
         displayAlert("El nombre no es valido", e.target.parentElement);
         customerOBJ[e.target.id] = "";
         return;
     }

     if (!validateEmail(e.target.value.trim()) && e.target.id === "email") {
         displayAlert(`El email no es valido`, e.target.parentElement);
         customerOBJ[e.target.id] = "";
         return;
     }

     if (!validatePhoneNumber(e.target.value.trim()) && e.target.id === "telefono") {
         displayAlert("El telefono no es correcto", e.target.parentElement);
         customerOBJ[e.target.id] = "";
         return;
     }

     clearAlert(e.target.parentElement);
     customerOBJ[e.target.id] = e.target.value.trim();
     validateCustomer();
 }

export function activarSpinner(form, spinner) {
    spinner.classList.remove("hidden")
    spinner.classList.add("flex")
    setTimeout(() => {
        spinner.classList.add("hidden")
        spinner.classList.remove("flex")
        clearForm(form)
        const mensaje = document.createElement("P")
        mensaje.classList.add("bg-green-500", "text-white", "text-center", "rounded-lg", "mt-10", "text-sm")
        mensaje.textContent = "El mensaje se ha enviado con exito"
        form.appendChild(mensaje)
        setTimeout(() => {
            form.removeChild(form.lastElementChild)
        }, 3000)
    }, 3000)
}
function clearForm(form) {
    customerOBJ.nombre = ""
    customerOBJ.email = ""
    customerOBJ.telefono = ""
    customerOBJ.empresa = ""
    form.reset()
    validateCustomer()
}
