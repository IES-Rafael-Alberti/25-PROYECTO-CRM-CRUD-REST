
import {createTable} from "./tableFunctions.js";

export let database;

document.addEventListener("DOMContentLoaded", createDatabase);

// Creates the database, handling upgrades, errors, and successes
export async function createDatabase() {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open("MyDatabase", 3);

        openRequest.onupgradeneeded = function (event) {
            // Use the global variable instead of creating a local one
            database = event.target.result;
            let objectStore = database.createObjectStore("customers", { keyPath: "email" });
            objectStore.createIndex("nombre", "nombre", { unique: false });
            objectStore.createIndex("email", "email", { unique: true });
            objectStore.createIndex("telefono", "telefono", { unique: false });
            objectStore.createIndex("empresa", "empresa", { unique: false });
            console.log("Database opened successfully during upgrade.");
        };

        openRequest.onsuccess = function (event) {
            // Use the global variable instead of creating a local one
            database = event.target.result;
            console.log("Database opened successfully:", database);
            resolve(database); // Resolve the promise with the database instance
        };

        openRequest.onerror = function (event) {
            console.error("Error opening database:", event.target.error);
            reject(event.target.error); // Reject the promise with the error
        };
    });
}





// Gets the object store of the database

export async function getObjectStore() {
    if (!database) {
        throw new Error("Database is undefined. Make sure it is properly initialized.");
    }

    const transaction = await database.transaction("customers", "readwrite");
    const objectStore = transaction.objectStore("customers");

    console.log("Object Store:", objectStore);

    return objectStore;
}


export function createCursor(objectStore, informationArray, tableBody) {
    console.log(objectStore);
    const cursorRequest = objectStore.openCursor();

    cursorRequest.onsuccess = (event) => {
        getInfoUsingCursor(event, informationArray, tableBody);
    };

    // Use onerror event for error handling
    cursorRequest.onerror = (event) => {
        console.error("Error opening cursor:", event.target.error);
    };
}

function getInfoUsingCursor(event, informationArray, tableBody) {
    const cursor = event.target.result;
    if (cursor) {
        const info = cursor.value;
        informationArray.push(info);
        cursor.continue();
    } else {
        createTable(informationArray, tableBody);
    }
}


