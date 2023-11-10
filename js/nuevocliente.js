import { validar} from "./utilityFiles/funciones.js";
import { form, inputName,inputBusiness,inputEmail,inputPhoneNumber,addToDatabase } from "./utilityFiles/formHandler.js"
import { createDatabase} from "./utilityFiles/database.js";

document.addEventListener("DOMContentLoaded", async () => {

    inputName.addEventListener("blur", validar)
    inputEmail.addEventListener("blur", validar)
    inputPhoneNumber.addEventListener("blur", validar)
    inputBusiness.addEventListener("blur", validar)

    // Handling form submission

    form.addEventListener("submit", async (e) => {
        await createDatabase()
        e.preventDefault();
        if (inputEmail.value.trim() === "") {
            console.error("Email is required.");
            return;
        }
        addToDatabase();
    });
})
