<script>
    // @ts-nocheck
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    async function handleChangeConditions() {
        try {
            const ret = await fetch(`/api/issue?magazineId=${magazine}&year=${year}`)
            issues = await ret.json();;
        } catch (e) {
            alert(e.message);
        }
    }

    onMount(async () => {
        const params = $page.url.searchParams;
        magazine = params.get("magazine-id") ?? "WSMG";
        year = params.get("year") ?? "2024";
        await handleChangeConditions();
    })

    export let data;
    let magazine = "WSMG";
    let year = "2024";
    let issues = [];
</script>

<div class="page-container">
    <h1>Issue List</h1>
    <div>
        <form>
            <div>
                <label for="magazine">タイトル :</label>
                <select id="magazine" bind:value={magazine} on:change={handleChangeConditions}>
                    {#each data.magazines as magazine}
                    <option value={magazine.id}>{magazine.title}</option>
                   {/each}        
                </select>
                <label for="year">年度 :</label>
                <select id="year" bind:value={year} on:change={handleChangeConditions}>
                    <option value="2022">2022年</option>
                    <option value="2023" selected>2023年</option>
                    <option value="2024">2024年</option>
                </select>    
                <span><a href="/issue/append?magazine-id={magazine}&year={year}">追加</a></span>
            </div>            
        </form>
    </div>
    <div>
    </div>
    <div>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>号数</th>
                    <th>掲載数</th>
                    <th>摘要</th>
                </tr>
            </thead>
            <tbody>
                {#each issues as issue, i (issue.id)}
                <tr>
                    <td>{i + 1}</td>
                    <td><a href="/issue/{issue.id}">{issue.title}</a></td>
                    <td>{issue.count_of_title}</td>
                    <td>{issue.description ?? ""}</td>
                </tr>
                {/each}                        
            </tbody>
        </table>
    </div>
    <div>
        <a href="/">戻る</a>
    </div>
</div>

<style>
    .page-container {
        margin: 1em 2em;
        width: 800px;
    }
    form > div {
        margin-bottom: 5px;
    }
    form > div > label {
        display: inline-block;
        margin-left: 1em;
    }
    form > div > span {
        margin-left: 1em;
    }
    form > div > select {
        padding: 0.5em 0.5em;
    }
    table > thead > tr > th {
        padding: 0.5em 0.5em;
    }
    table > tbody > tr > td {
        padding: 0.2em 0.5em;
    }
</style>