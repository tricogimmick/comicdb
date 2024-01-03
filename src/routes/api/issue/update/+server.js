// @ts-nocheck
import { json } from '@sveltejs/kit';
import { Database } from "sqlite3";
import { env } from '$env/dynamic/private';

function getTitles(db, names) {
    return new Promise((ok,ng) => {
        db.all("SELECT id, title FROM titles WHERE title in (" +  names.map(x => "?").join(",") + ")", names, (err, rows) => {
            if (err) {
                return ng(err);
            } else {
                return ok(rows);
            }
        })
    });
}

async function updateIssue(request) {
    const dbPath = env["COMICDB_PATH"];
    const db = new Database(dbPath);

    const titles = await getTitles(db, request.covers);

    return new Promise((ok, ng) => {
        db.serialize(() => {
            db.run("UPDATE issues SET title = ?, cover_url = ?, toc_url = ?, description = ? WHERE id = ?", 
                request.title, request.coverUrl, request.tocUrl, request.description, request.issueId);
            db.run("DELETE FROM covers WHERE issue_id = ?", request.issueId);
            for (const coverTitle of request.covers) {
                const title = titles.find(x => x.title === coverTitle);
                if (title != null && title != "") {
                    db.run("INSERT INTO covers VALUES (?, ?)", request.issueId, title.id);
                }
            }
            db.run("DELETE FROM contents WHERE issue_id = ?", request.issueId);
            for (const x of request.contents) {
                const serializationStatus = x.serializationStatus == "" ? null : Number(x.serializationStatus);
                db.run("INSERT INTO contents VALUES (?,?,?,?,?,?,?,?)", 
                    request.issueId, x.no, x.titleId, x.pageNo, 
                    Number(x.contentType) , x.isColor ? 1 : 0, serializationStatus, x.description);
            }
            ok();    
        });
        db.close();    
    });
}

export async function POST({ request }) {
    try {
        const requesJson = await request.json();
        await updateIssue(requesJson);
        return json({ result: "OK" }, { status: 201 })    
    }
    catch (e) {
        return json({ result: e.message  }, { status: 500 })    
    }
}
