// @ts-nocheck
import { json } from '@sveltejs/kit';
import { Database } from "sqlite3";
import { env } from '$env/dynamic/private';

function UpdateIssue(request) {
    const dbPath = env["COMICDB_PATH"];
    const db = new Database(dbPath);
    return new Promise((ok, ng) => {
        db.serialize(() => {
            db.run("UPDATE issues SET title = ?, cover_url = ?, toc_url = ?, description = ? WHERE id = ?", 
                request.title, request.coverUrl, request.tocUrl, request.description, request.issueId);
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
        await UpdateIssue(requesJson);
        return json({ result: "OK" }, { status: 201 })    
    }
    catch (e) {
        return json({ result: e.message  }, { status: 500 })    
    }
}
