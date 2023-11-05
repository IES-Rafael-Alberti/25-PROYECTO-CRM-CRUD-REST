# IndexedDB

Is an embedded and asynchronous database that can be used with js, in order to create a proejct with IndexedDB, 
you have to create the database first, we can do so like this: 

```javascript
    // The first value is the name of the database and the
    // second is the version we want to use
    const openRequest = indexedDB.open("MyDatabase", 1);
```

Now we have to describe how the database is estructured, for this we use onupgradeneeded to create a database refence and
to create the table that we need to store the information to do so we can do it like this 

```javascript
    openRequest.onupgradeneeded = function (event) {
        database = event.target.result; 
        let objectStore = database.createObjectStore("customers", { keyPath: "email" });
        objectStore.createIndex("nombre", "nombre", { unique: false });
        objectStore.createIndex("email", "email", { unique: true });
        objectStore.createIndex("telefono", "telefono", { unique: true });
        objectStore.createIndex("empresa", "empresa", { unique: false });
    };

    // this code creates a table for the customers having the primary key being the email since it is unique and the 
    // telephone number which is not part of the primary key but it is still unique 
```
It is also important that to access the database you need a reference to it and that to open the same database while 
dealing with multiple files you have to create the same open request, that's why the transaction and store code are repeated multiple times in the examples and in the code of the exercise 

Having created our table we can start adding data into the table, we create a transaction into our table where we then 
add our new object with the information 

```javascript
        const transaction = database.transaction('customers', 'readwrite');
        const store = transaction.objectStore('customers');
        const request = store.add(customerOBJ);
        
        // this should add the information into the table but there are cases where an error occours due to the data not matching or existing already in the database, if we want to know where the data has been added we can 
```

Now to extract the information form the database we can use a cursor:

```javascript
const cursorRequest = objectStore.openCursor();
cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
        // like this we can get all the info from the database 
        const obj = cursor.value;
        informationArray.push(obj);
        cursor.continue(); 
    } else {
        createTable(informationArray)
    }
};
```

Another thing we can do with this is create new promises, a promise is a way to control the result from the database, 
since it can be either sucessful or not it provides more control over the database. All the examples shown before are 
promises, however we can create our own if we find it necessary, here is an example.

```javascript
// We create the new promise 
return new Promise((resolve, reject) => {
    const transaction = database.transaction("customers", "readwrite");
    const objectStore = transaction.objectStore("customers");
    const request = objectStore.get(id);
    // we define a succesful outcome 
    request.onsuccess = (event) => {
        const email = event.target.result;
        resolve(email);
    };
    // We define an outcome for errors
    request.onerror = (event) => {
        reject(event.target.error);
    };
});
```

To update the information from the database we have to get the new values and then use the put function to update it:

```javascript
function saveToDatabase() {
        const transaction = database.transaction("customers", "readwrite");
        const objectStore = transaction.objectStore("customers");

        // Update customerOBJ with the latest form data
        customerOBJ.nombre = inputName.value.trim();
        customerOBJ.email = inputEmail.value.trim();
        customerOBJ.telefono = inputPhoneNumber.value.trim();
        customerOBJ.empresa = inputBusiness.value.trim();

        // Use the put method to update the data
        objectStore.put(customerOBJ);

        transaction.oncomplete = function() {
            console.log('Data updated successfully');
        };
    }

```

for deleting information just use the delete function with the key of the item you want to delete as a parameter 

```javascript
button.addEventListener("click", () =>{
    let removeButton = document.querySelector(`#remove-button${i}`);
    const transaction = database.transaction("customers", "readwrite");
    const objectStore = transaction.objectStore("customers");
    objectStore.delete(item.email).onsuccess = (event) => {
        removeButton.parentElement.parentElement.remove(removeButton.parentElement);
    };
})
```