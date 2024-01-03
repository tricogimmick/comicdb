<script>
    // @ts-nocheck
    import { goto } from '$app/navigation';

    function hadleClickAddAuthor(e) {
        e.preventDefault();
        e.stopImmediatePropagation();    
        authors = [...authors, ""];
    } 

    function hadleClickAddScripter(e) {
        e.preventDefault();
        e.stopImmediatePropagation();    
        scripters = [...scripters, ""];
    } 

    async function handleClickSubmit(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (!confirm("登録しますか？")) {
            return;
        }

        const request = {
            title,
            contentType,
            publication,
            isCompletion,
            description,
            authors,
            scripters
        }
        try {
            const ret = await fetch("/api/title/append", {
                method: "POST",
                body: JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            goto(`/title/`);
        } catch (e) {
            alert(e.message);
            return
        }
    }

    export let data;

    let title = "";
    let authors = [""];
    let scripters = [""];
    let contentType = "0";
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
                <label for="authors0">漫画家 :</label>
                <div>
                    {#each authors as author, i}
                    <input type="text" id="authors{i}" list="author-list" bind:value={author} ><br>
                    {/each} 
                    <button on:click={hadleClickAddAuthor}>追加</button>
                </div>
                <label for="scripter0">原作者 :</label><br>
                <div>
                    {#each scripters as scripter, j}
                    <input type="text" id="scripter{j}" list="author-list" bind:value={scripter} ><br>
                    {/each} 
                    <button on:click={hadleClickAddScripter}>追加</button>
                </div>    
            </div>
            <div>
                <label for="contentType">種別 :</label>
                <select id="contentType" bind:value={contentType}>
                    <option value="0">読み切り</option>
                    <option value="1">連載</option>
                </select>
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
        <div><a href="/title">戻る</a></div>
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
    form label {
        display: inline-block;
        width: 4em;
        margin-right: 0.5em;
    }
    form input {
        padding: 0.5em 0.5em;        
    }
    form select {
        padding: 0.5em 0.5em;        
    }    
    form button {
        margin-top: 0.5em;
    }
    .authors-container {
        display: flex;
    }
    .authors-container > label {
        display: block;
    }
    .authors-container > div {
        margin-left: 0.3em;
        margin-right: 2em;
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