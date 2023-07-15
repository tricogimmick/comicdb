// @ts-nocheck
import { json } from '@sveltejs/kit';
import { Database } from "sqlite3";

function AppendIssue(request) {
    const db = new Database("C:\\Users\\osamu\\Data\\comicdb.sqlite3");
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
