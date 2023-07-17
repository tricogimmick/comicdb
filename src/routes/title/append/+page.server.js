// @ts-nocheck
import { Database } from "sqlite3";
import { env } from '$env/dynamic/private';

function getMagazines() {
    const dbPath = env["COMICDB_PATH"];
    const db = new Database(dbPath);
    return new Promise((ok, ng) => {
        db.all("SELECT * FROM magazines", (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows);
            }
        });
    });
}

function getAuthors() {
    const dbPath = env["COMICDB_PATH"];
    const db = new Database(dbPath);
    return new Promise((ok, ng) => {
        db.all("SELECT * FROM authors", (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows);
            }
        });
    });
}

export async function load() {
    return {
        magazines: await getMagazines(),
        authors: await getAuthors()
    };
}