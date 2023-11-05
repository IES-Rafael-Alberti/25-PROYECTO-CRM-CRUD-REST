
document.addEventListener("DOMContentLoaded", () => {

    // Cosntants and variables 

    const openRequest = indexedDB.open("MyDatabase", 3);
    const inputName = document.querySelector("#nombre")
    const inputEmail = document.querySelector("#email")
    const inputPhoneNumber = document.querySelector("#telefono")
    const inputBusiness = document.querySelector("#empresa")
    const summitButton = document.querySelector('#formulario button[type="submit"]');
    const form = document.querySelector("#formulario")
    const spinner = document.querySelector('#spinner')
    let database; 

    // Listeners 

    inputName.addEventListener("blur", validar)
    inputEmail.addEventListener("blur", validar);
    inputPhoneNumber.addEventListener("blur", validar);
    inputBusiness.addEventListener("blur", validar);

    // creating object 

    const customerOBJ = {
        email: "",
        nombre: "",
        telefono: "",
        empresa: ""
    }

    // Databse functions 

    openRequest.onupgradeneeded = function (event) {
        database = event.target.result; // Assign the database reference to the global db variable
        let objectStore = database.createObjectStore("customers", { keyPath: "email" });
        objectStore.createIndex("nombre", "nombre", { unique: false });
        objectStore.createIndex("email", "email", { unique: true });
        objectStore.createIndex("telefono", "telefono", { unique: true });
        objectStore.createIndex("empresa", "empresa", { unique: false });
    };

    openRequest.onsuccess = function (event) {
        database = event.target.result;
        console.log("Database opened successfully.");
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
        const transaction = database.transaction('customers', 'readwrite');
        const store = transaction.objectStore('customers');
        const request = store.add(customerOBJ);
        request.onsuccess = () => {
            activarSpinner()
        };

        request.onerror = () => {
            console.error('Error adding data.');
        };
    });

    function activarSpinner(){
        spinner.classList.remove("hidden")
        spinner.classList.add("flex")
        setTimeout(()=>{
            spinner.classList.add("hidden")
            spinner.classList.remove("flex")
            clearForm()
            const mensaje = document.createElement("P")
            mensaje.classList.add("bg-green-500", "text-white", "text-center", "rounded-lg", "mt-10", "text-sm")
            mensaje.textContent = "El mensaje se ha enviado con exito"
            form.appendChild(mensaje)
            setTimeout(() =>{
                form.removeChild(form.lastElementChild)
            },3000)
        },3000)
    }
    function clearForm(){
        customerOBJ.nombre =""
        customerOBJ.email =""
        customerOBJ.telefono =""
        customerOBJ.empresa =""
        form.reset()
        validateCustomer()
    }

    // Validate form field 

    function validar(e) {
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


    // Summit button handler

    function validateCustomer() {
        const values = Object.values(customerOBJ)
        console.log(values, "Values")
        if (values.includes("")){
            summitButton.classList.add("opacity-50")
            summitButton.disabled = true
            return
        }
        summitButton.classList.remove("opacity-50")
        summitButton.disabled = false
    }



    // Alert Functions

    function clearAlert(referencia)  {
        const alerta = referencia.querySelector(".bg-red-600")
        if (alerta) {
            alerta.remove()
        }
    }

    function displayAlert(mensaje, referencia)  {
        clearAlert(referencia)
        const error = document.createElement("P")
        error.textContent = mensaje
        error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
        referencia.appendChild(error)

    }

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
})
