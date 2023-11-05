document.addEventListener("DOMContentLoaded", () => {

    const openRequest = indexedDB.open("MyDatabase", 3);
    const customerEmailString = localStorage.getItem('customerEmail');
    const inputName = document.querySelector("#nombre")
    const inputEmail = document.querySelector("#email")
    const inputPhoneNumber = document.querySelector("#telefono")
    const inputBusiness = document.querySelector("#empresa")
    const submitButton = document.querySelector('#formulario button[type="submit"]');
    const form = document.querySelector("#formulario")
    const customerEmail = JSON.parse(customerEmailString);
    let database;




    const customerOBJ = {
        email: "",
        nombre: "",
        telefono: "",
        empresa: ""
    }
    openRequest.onsuccess = (event) => {
        const database = event.target.result;

        // Now, you can perform your database operations.
        const transaction = database.transaction("customers", "readwrite");
        const objectStore = transaction.objectStore("customers");
        const request = objectStore.get(inputEmail.value.trim());

        request.onsuccess = (event) => {
            const existingCustomer = event.target.result;
            setFormInfo(existingCustomer);
        };
    };

    function setFormInfo(item) {
        inputName.value = item.nombre;
        inputEmail.value = item.email;
        inputPhoneNumber.value = item.telefono;
        inputBusiness.value = item.empresa;
    }

    inputName.addEventListener("blur", validar)
    inputEmail.addEventListener("blur", validar);
    inputPhoneNumber.addEventListener("blur", validar);
    inputBusiness.addEventListener("blur", validar);
    submitButton.addEventListener("click", saveToDatabase);

    function updateCustomerDiferentId(objectStore, transaction) {
        const deleteRequest = objectStore.delete(customerOBJ.email);
        deleteRequest.onsuccess = () => {
            customerOBJ.email = inputEmail.value.trim();
            customerOBJ.nombre = inputName.value.trim();
            customerOBJ.telefono = inputPhoneNumber.value.trim();
            customerOBJ.empresa = inputBusiness.value.trim();
            objectStore.put(customerOBJ);
            transaction.oncomplete = function () {
                console.log('Data updated successfully');
                window.location.href = 'index.html'
            };
        };
    }

    function updatadeCustomerSameId(objectStore, transaction) {
        customerOBJ.nombre = inputName.value.trim();
        customerOBJ.telefono = inputPhoneNumber.value.trim();
        customerOBJ.empresa = inputBusiness.value.trim();

        objectStore.put(customerOBJ);
        transaction.oncomplete = function () {
            console.log('Data updated successfully');
            window.location.href = 'index.html'
        };
    }

    function saveToDatabase() {
        const transaction = database.transaction("customers", "readwrite");
        const objectStore = transaction.objectStore("customers");
        if (customerOBJ.email !== inputEmail.value.trim()) {
            const request = objectStore.get(inputEmail.value.trim());
            request.onsuccess = (event) => {
                const existingCustomer = event.target.result;
                if (existingCustomer) {
                    displayAlert("Email already in use. Please choose a different email.", form);
                } else {
                    updateCustomerDiferentId(objectStore, transaction);
                }
            };
        } else {
            updatadeCustomerSameId(objectStore, transaction);
        }
    }




    openRequest.onsuccess = (event) => {

        database = event.target.result;
        const transaction = database.transaction("customers", "readwrite");
        const objectStore = transaction.objectStore("customers")
        const request = objectStore.get(customerEmail);
        request.onsuccess = (event) => {
            const item = event.target.result;
            if (item) {
                console.log(item.email)

            } else {
                console.log("Item not found.");
            }
        };

        request.onerror = (event) => {
            console.error("Error getting item:", event.target.error);
        };
    }





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
            submitButton.classList.add("opacity-50")
            submitButton.disabled = true
            return
        }
        submitButton.classList.remove("opacity-50")
        submitButton.disabled = false
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