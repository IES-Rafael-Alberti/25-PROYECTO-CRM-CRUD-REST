import {createCursor, createDatabase, database, getObjectStore} from "./utilityFiles/database.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#listado-clientes");
    document.addEventListener("innerContentReady", async () => {
        await getInfoInDB();
    });

    document.dispatchEvent(new Event("innerContentReady"));


    async function getInfoInDB() {
        try {
            await createDatabase();
            const objectStore = getObjectStore(database);
            const informationArray = [];
            console.log("Database created successfully");
            createCursor(objectStore, informationArray, tableBody);
        } catch (error) {
            console.error("Error in getInfoInDB:", error);
        }
    }

});