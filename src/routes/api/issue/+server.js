// @ts-nocheck
import { json } from '@sveltejs/kit';
import { Database } from "sqlite3";
import { env } from '$env/dynamic/private';
import { page } from '$app/stores';

function GetIssues(magazineId, year) {
    const dbPath = env["COMICDB_PATH"];
    const db = new Database(dbPath);
    const p = new Promise((ok, ng) => {
        const issueId = `${magazineId}${year}%`;
        db.all(
            "SELECT i.id, i.title, count(*) as count_of_title " +
            "FROM issues as i " +
            "LEFT JOIN episodes as e ON e.issue_id = i.id " +
            "WHERE i.magazine_id = ? AND i.id like ? " +
            "GROUP BY i.id, i.title",
            [magazineId, issueId],
            (err, rows) => {
                if (err) {
                    ng(err);
                } else {
                    ok(rows);
                }
            });
    });
    return p;   
}

export async function GET({ url }) {
    try {
        const params = (new URL(url)).searchParams;
        if (params.get("issueId")) {
            //
        } else {
            const issues = await GetIssues(params.get("magazineId"), params.get("year"));
            return json(issues, { status: 201 })                    
        }        
    }
    catch (e) {
        return json({}, { status: 500 })    
    }
}
