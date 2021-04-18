let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoincrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("No can do" + event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction( ["pending"], "readwrite");
    const store = transaction.objectStore ("pending");
    store.add(record);
} //end of save record function

function checkDatabase () {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST", 
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }//end of headers
            })//end of fetch function and if statemenyt
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            }); //end of second .then clearing the store after bulk and success
        } //closes fetch
    }; //closes the get all on success function
    }//end of the checkDatabase

window.addEventListener("online", checkDatabase); 