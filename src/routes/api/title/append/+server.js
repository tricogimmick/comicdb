// @ts-nocheck
import { json } from '@sveltejs/kit';
import { Database } from "sqlite3";
import { env } from '$env/dynamic/private';
import { isReturnStatement } from 'typescript';

async function AppendTitle(db, request) {
    return new Promise((ok, ng) => {
        db.serialize(() => {
            db.run("INSERT INTO titles (title, publication, completion, description) VALUES (?,?,?,?)", 
                request.title, request.publication, request.isCompletion ? 1 : 0, request.description);
            db.get("SELECT id FROM titles WHERE title = ?", [request.title], (err, rec) => {
                if (err) {
                    ng(err);
                } else {
                    if (rec != null) {
                        ok(rec["id"]);
                    } else {
                        ng({ message: "IDが取得できなかった"});
                    }
                }
            });
        });
    });
}

async function GetAuthorId(db, name) {
    return new Promise((ok, ng) => {
        db.get("SELECT id FROM authors WHERE name = ?", [name], (err, rec) => {
            if (err || rec == null) {
                ok(null);
            } else {
                ok(rec["id"]);
            }
        })
    });
}

async function AppendAuthor(db, name) {
    return new Promise((ok,ng) => {
        db.serialize(() => {
            db.run("INSERT INTO authors (name) VALUES (?)", name);
            db.get("SELECT id FROM authors WHERE name = ?", [name], (err, rec) => {
                if (err) {
                    ng(err);
                } else {
                    if (rec != null) {
                        ok(rec["id"]);
                    } else {
                        ng({ message: "IDが取得できなかった" })
                    }
                }
            });
        })    
    })
}

async function AppendTitleAuthor(db, titleId, name, authorType) {
    let authorId = await GetAuthorId(db, name);
    if (authorId == null) {
        authorId = await AppendAuthor(db, name);
    }
    db.run("INSERT INTO title_authors VALUES (?,?,?)", titleId, authorId, authorType);
}

export async function POST({ request }) {
    try {
        const requesJson = await request.json();
        const dbPath = env["COMICDB_PATH"];
        const db = new Database(dbPath);
        const titleId = await AppendTitle(db, requesJson);
        for (let author of requesJson.authors) {
            if (author != null && author != "") {
                await AppendTitleAuthor(db, titleId, author, "AUTHOR");
            }
        }
        for (let playwright of requesJson.playwrights) {
            if (playwright != null && playwright != "") {
                await AppendTitleAuthor(db, titleId, playwright, "SCREENPLAY");
            }
        }
        db.close();
        return json({ result: "OK",  titleId }, { status: 201 })    
    }
    catch (e) {
        return json({ result: e?.message  }, { status: 500 })    
    }
}
