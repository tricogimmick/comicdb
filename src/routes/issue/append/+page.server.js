// @ts-nocheck
import { Database } from "sqlite3";
import { env } from '$env/dynamic/private';

function getMagazines(db) {
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

function getTitles(db) {
    return new Promise((ok, ng) => {
        db.all("SELECT * FROM titles", (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows);
            }
        });
    });
}

export async function load() {
    const dbPath = env["COMICDB_PATH"];
    const db = new Database(dbPath);
    const magazines = await getMagazines(db);
    const titles = await getTitles(db);
    db.close();
    return {
        magazines,
        titles
    };
}