<script>
    // @ts-nocheck
    async function handleChangeConditions() {
        try {
            const ret = await fetch(`/api/issue?magazineId=${magazine}&year=${year}`)
            const data = await ret.json();
            console.log(data);
            issues = data;
        } catch (e) {
            alert(e.message);
            return
        }
    }

    export let data;
    let magazine = "WSMG";
    let year = "2023";
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
                    <option value="2023" selected>2023年</option>
                    <option value="2024">2024年</option>
                </select>    
            </div>            
        </form>
    </div>
    <div>
        {#each issues as issue (issue.id)}
        <div>{issue.id} : {issue.title} {issue.count_of_title}</div>
        {/each}
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
    form > div > select {
        padding: 0.5em 0.5em;
    }
</style>