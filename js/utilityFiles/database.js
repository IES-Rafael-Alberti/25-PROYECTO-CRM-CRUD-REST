
import {createTable} from "./tableFunctions.js";

export let database;
document.addEventListener("DOMContentLoaded", createDatabase)

// Creates the  database, handling upgrades,errors and successes
export async function createDatabase() {
    const openRequest = await indexedDB.open("MyDatabase", 3);
    openRequest.onupgradeneeded = function (event) {
        database = event.target.result; // Assign the database.js reference to the global db variable
        let objectStore = database.createObjectStore("customers", {keyPath: "email"});
        objectStore.createIndex("nombre", "nombre", {unique: false});
        objectStore.createIndex("email", "email", {unique: true});
        objectStore.createIndex("telefono", "telefono", {unique: true});
        objectStore.createIndex("empresa", "empresa", {unique: false});
        console.log("Database opened successfully.");
    };
    openRequest.onsuccess = function (event) {
        database = event.target.result; // Assign the database.js reference to the global db variable
        console.log(database)
    };

    openRequest.onerror = function (event) {
        console.error("Error opening database.js:", event.target.error);
    };
}



// Gets the object store of the database

export function getObjectStore() {
    const transaction = database.transaction("customers", "readwrite");
    return transaction.objectStore("customers")
}


export function createCursor(objectStore, informationArray,tableBody) {
    const cursorRequest = objectStore.openCursor();
    cursorRequest.onsuccess = (event) => {
        console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBbb")
        getInfoUsingCursor(event, informationArray,tableBody);
    };
    cursorRequest.error = (event) => {
        console.error("Error opening database.js:", event.target.error);
    }
}

function getInfoUsingCursor(event, informationArray,tableBody) {
    const cursor = event.target.result;
    if (cursor) {
        const info = cursor.value;
        informationArray.push(info);
        cursor.continue();
    } else {
        console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDd")
        createTable(informationArray,tableBody)
    }
}