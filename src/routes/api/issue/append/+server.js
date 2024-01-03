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

async function AppendIssue(request) {
    const dbPath = env["COMICDB_PATH"];
    const db = new Database(dbPath);

    const titles = await getTitles(db, request.covers);

    db.run("INSERT INTO issues VALUES (?,?,?,?,?,?)", 
        request.issueId, request.magazineId, request.title, request.coverUrl, request.tocUrl, request.description);
    for (const coverTitle of request.covers) {
        const title = titles.find(x => x.title === coverTitle);
        if (title != null && title != "") {
            db.run("INSERT INTO covers VALUES (?, ?)", request.issueId, title.id);
        }
    }        
    for (const x of request.contents) {
        const serializationStatus = x.serializationStatus == "" ? null : Number(x.serializationStatus);
        db.run("INSERT INTO contents VALUES (?,?,?,?,?,?,?,?)", 
            request.issueId, x.no, x.titleId, x.pageNo, 
            Number(x.contentType) , x.isColor ? 1 : 0, serializationStatus, x.description);
    }
    db.close();
}

export async function POST({ request }) {
    try {
        const requesJson = await request.json();
        await AppendIssue(requesJson);
        return json({ result: "OK" }, { status: 201 })    
    }
    catch (e) {
        return json({ result: e.message  }, { status: 500 })    
    }
}
