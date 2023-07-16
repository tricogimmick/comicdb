// @ts-nocheck
import { json } from '@sveltejs/kit';
import { Database } from "sqlite3";
import { env } from '$env/dynamic/private';

function AppendIssue(request) {
    const dbPath = env["COMICDB_PATH"];
    const db = new Database(dbPath);
    db.run("INSERT INTO issues VALUES (?,?,?,?,?)", 
        request.issueId, request.magazineId, request.title, request.coverUrl, request.tocUrl);
    for (const x of request.episodes) {
        db.run("INSERT INTO episodes VALUES (?,?,?,?,?,?,?)", 
            request.issueId, x.no, x.titleId, x.pageNo, 
            Number(x.serialization) , x.isColor ? 1 : 0, x.notice);
    }
    db.close();
}

export async function POST({ request }) {
    try {
        const requesJson = await request.json();
        AppendIssue(requesJson);
        return json({ result: "OK" }, { status: 201 })    
    }
    catch (e) {
        return json({ result: e.message  }, { status: 500 })    
    }
}
