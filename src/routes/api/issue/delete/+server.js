// @ts-nocheck
import { json } from '@sveltejs/kit';
import { Database } from "sqlite3";
import { env } from '$env/dynamic/private';

function DeleteIssue(request) {
    const dbPath = env["COMICDB_PATH"];
    const db = new Database(dbPath);
    return new Promise((ok, ng) => {
        db.serialize(() => {
            db.run("DELETE FROM issues WHERE id = ?", request.issueId);
            db.run("DELETE FROM contents WHERE issue_id = ?", request.issueId);
            ok();    
        });
        db.close();    
    });
}

export async function POST({ request }) {
    try {
        const requesJson = await request.json();
        await DeleteIssue(requesJson);
        return json({ result: "OK" }, { status: 201 })    
    }
    catch (e) {
        return json({ result: e.message  }, { status: 500 })    
    }
}
