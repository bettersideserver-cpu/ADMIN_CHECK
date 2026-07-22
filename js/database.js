// ===============================
// database.js
// ===============================
import { db } from "./firebase.js";
const DB_KEY = "realEstateDB";

// --------------------------------
// Default Database
// --------------------------------

const defaultDB = {

    visitors: [],

    properties: {

        Flat101: "Available",
        Flat102: "Sold",
        Flat103: "Reserved"

    },

    categories: {

        Available: "#22c55e",
        Sold: "#ef4444",
        Reserved: "#f59e0b"

    }

};

// --------------------------------
// Initialize
// --------------------------------

(function init() {

    if (!localStorage.getItem(DB_KEY)) {

        localStorage.setItem(

            DB_KEY,

            JSON.stringify(defaultDB)

        );

    }

})();

// --------------------------------
// Read Database
// --------------------------------

export function getDB() {

    return JSON.parse(

        localStorage.getItem(DB_KEY)

    );

}

// --------------------------------
// Save Database
// --------------------------------

export function saveDB(db) {

    localStorage.setItem(

        DB_KEY,

        JSON.stringify(db)

    );

}

// =======================================
// Visitor
// =======================================

export function addVisitor(name, phone, email) {

    const db = getDB();

    const visitor = {

        id: "USER-" + Date.now(),

        name,

        phone,

        email,

        status: "Pending",

        accessTime: 5,

        createdAt: Date.now(),

        expiresAt: null

    };

    db.visitors.push(visitor);

    saveDB(db);

    return visitor;

}

export function getVisitors() {

    return getDB().visitors;

}

export function getVisitor(id) {

    return getDB().visitors.find(

        v => v.id === id

    );

}

// =======================================
// Approve
// =======================================

export function approveVisitor(id, minutes) {

    const db = getDB();

    const visitor = db.visitors.find(v => v.id === id);

    if (!visitor) return;

    visitor.status = "Approved";

    visitor.accessTime = minutes;

    visitor.expiresAt = Date.now() + (minutes * 60 * 1000);

    saveDB(db);

}

// =======================================
// Reject
// =======================================

export function rejectVisitor(id) {

    const db = getDB();

    const visitor = db.visitors.find(

        v => v.id === id

    );

    if (!visitor) return;

    visitor.status = "Rejected";

    saveDB(db);

}


// =======================================
// Delete Visitor
// =======================================

export function deleteVisitor(id) {

    const db = getDB();

    db.visitors = db.visitors.filter(v => v.id !== id);

    saveDB(db);

}
// =======================================
// Expire
// =======================================

export function expireVisitor(id) {

    const db = getDB();

    const visitor = db.visitors.find(

        v => v.id === id

    );

    if (!visitor) return;

    visitor.status = "Expired";

    saveDB(db);

}

// =======================================
// Properties
// =======================================

export function getProperties() {

    return getDB().properties;

}

export function updateProperty(id, status) {

    const db = getDB();

    db.properties[id] = status;

    saveDB(db);

}

// =======================================
// Categories
// =======================================

export function getCategories() {

    return getDB().categories;

}

export function addCategory(name, color) {

    const db = getDB();

    db.categories[name] = color;

    saveDB(db);

}

export function updateCategory(name, color) {

    const db = getDB();

    db.categories[name] = color;

    saveDB(db);

}

export function deleteCategory(name) {

    const db = getDB();

    delete db.categories[name];

    saveDB(db);

}

// =======================================
// Session
// =======================================

export function checkExpiredVisitors() {

    const db = getDB();

    const now = Date.now();

    db.visitors.forEach(visitor => {

        if (

            visitor.status === "Approved" &&

            visitor.expiresAt &&

            now >= visitor.expiresAt

        ) {

            visitor.status = "Expired";

        }

    });

    saveDB(db);

}