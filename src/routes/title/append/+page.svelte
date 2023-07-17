<script>
    // @ts-nocheck

    function hadleClickAddAuthor(e) {
        e.preventDefault();
        e.stopImmediatePropagation();    
        authors = [...authors, ""];
    } 

    function hadleClickAddPlaywright(e) {
        e.preventDefault();
        e.stopImmediatePropagation();    
        playwrights = [...playwrights, ""];
    } 

    async function handleClickSubmit(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const request = {
            title,
            publication,
            isCompletion,
            description,
            authors,
            playwrights
        }
        console.log(request);
        try {
            const ret = await fetch("/api/title/append", {
                method: "POST",
                body: JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await ret.json();
        } catch (e) {
            alert(e.message);
            return
        }
    }

    export let data;

    let title = "";
    let authors = [""];
    let playwrights = [""];
    let publication = "";
    let isCompletion = false;
    let description = "";
</script>

<div class="page-container">
    <h1>New Title</h1>
    <div>
        <form on:submit={handleClickSubmit}>
            <div>
                <label for="title">作品名 :</label>
                <input type="text" id="title" bind:value={title} > 
            </div>
            <div class="authors-container">
                <datalist id="author-list">
                    {#each data.authors as author}
                    <option value={author.name}></option>
                    {/each}
                </datalist>
                <div>
                    <label for="authors0">漫画家 :</label><br>
                    {#each authors as author, i}
                    <input type="text" id="authors{i}" list="author-list" bind:value={author} ><br>
                    {/each} 
                    <button on:click={hadleClickAddAuthor}>追加</button>
                </div>
                <div>
                    <label for="playwright0">原作者 :</label><br>
                    {#each playwrights as playwright, j}
                    <input type="text" id="authors{j}" list="author-list" bind:value={playwright} ><br>
                    {/each} 
                    <button on:click={hadleClickAddPlaywright}>追加</button>
                </div>    
            </div>
            <div>
                <label for="publication">掲載誌 :</label>
                <select id="publication" bind:value={publication}>
                    {#each data.magazines as magazine}
                    <option value={magazine.id}>{magazine.title}</option>
                {/each}        
                </select>    
            </div>
            <div>
                <label for="completion">完結済 :</label>
                <input type="checkbox" bind:checked={isCompletion} />
            </div>
            <div>
                <label for="description">備考 :</label><br>
                <textarea id="description" bind:value={description}></textarea>
            </div>
            <div class="buttons">
                <input type="submit" name="submit" value="登録">
            </div>    
        </form>
    </div>
</div>

<style>
    .page-container {
        margin: 1em 2em;
        width: 800px;
    }
    form > div {
        margin-bottom: 1em;
    }
    form > div > label {
        width: 20em;
        margin-right: 0.5em;
    }
    form > div input {
        padding: 0.5em 0.5em;        
    }
    form > div  select {
        padding: 0.5em 0.5em;        
    }    
    form > div button {
        margin-top: 0.5em;
    }
    .authors-container {
        display: flex;
        margin-left: -2em;
    }
    .authors-container > div {
        margin-left: 2em;
    }
    form > div.buttons {
        text-align: right;
    }    
    #title {
        width: 40em;
    }
    #description {
        width: 50em;
        height: 5em;
    }
</style>