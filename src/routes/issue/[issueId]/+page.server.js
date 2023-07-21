// @ts-nocheck
import { error } from "@sveltejs/kit";
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

function GetIssue(db, issueId) {
    return new Promise((ok, ng) => {
        db.get("SELECT * FROM issues WHERE id = ?", [issueId], (err, rec) => {
            if (err == null && rec != null) {
                db.all("SELECT c.*, t.title FROM contents as c JOIN titles as t ON t.id = c.title_id WHERE c.issue_id = ? ORDER BY c.order_no", [issueId], (err, rows) => {
                    if (!err && rows != null) {
                        rec.contents = rows;
                        ok(rec);
                    }
                });
            } else {
                ng("Issue Not Found");
            }
        });
    });
}

export async function load({ params }) {
    const issueId = params.issueId;
    try {
        const dbPath = env["COMICDB_PATH"];
        const db = new Database(dbPath);
        const issue = await GetIssue(db, issueId);
        const magazines = await getMagazines(db);
        const titles = await getTitles(db);
        db.close();
    
        return {
            issueId,
            issue,
            magazines,
            titles
        };    
    } catch (e) {
        throw error(404, e);
    }
}