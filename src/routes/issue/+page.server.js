import { Database } from "sqlite3";

function getMagazines() {
    const db = new Database("C:\\Users\\osamu\\Data\\comicdb.sqlite3");
    const p = new Promise((ok, ng) => {
        db.all("SELECT * FROM magazines", (err, rows) => {
            if (err) {
                ng(err);
            } else {
                ok(rows);
            }
        });
    });
    return p;   
}

export async function load() {
    return {
        magazines: await getMagazines()
    };
}