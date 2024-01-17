<script>
    // @ts-nocheck
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    function hadleClickAddCover(e) {
        e.preventDefault();
        e.stopImmediatePropagation();    
        covers = [...covers, ""];
    } 

    function newContent(no) {
        return {
            no,
            titleId: null,
            title: "",
            pageNo: null,
            contentType: "1",
            isColor: false,
            serializationStatus: "",
            descrption: "",
            error: false
        };
    }

    async function HandleChangeTitle(e) {
        const row = this.parentElement.parentElement;
        const contentNo = row.dataset.contentNo;
        const content = contents[contentNo -1];
        const title = data.titles.find(x => x.title == this.value);
        if (title) {
            content.titleId = title.id;
            if (title.content_type != null) {
                content.contentType = String(title.content_type);
                if (title.content_type == 1) {
                    content.serializationStatus = "2";
                }
            }
            content.error = false;
            row.classList.remove("error")
        } else {
            content.titleId = null;
            content.error = true;
            row.classList.add("error")
        }
        contents[contentNo -1] = content;
    }

    function handleClickAddButton(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const row = this.parentElement.parentElement;
        const contentNo = Number(row.dataset.contentNo);
        if (contentNo == contents.length) {
            contents = [...contents, newContent(contentNo + 1)];
        } else {
            const before = contents.slice(0, contentNo);
            const after = contents.slice(contentNo);
            after.forEach(x => x.no = Number(x.no) + 1);
            contents = [...before, newContent(contentNo + 1), ...after];
        }
    }

    function handleClickDelButton(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (!confirm("行を削除しますか？")) {
            return;
        }
        const row = this.parentElement.parentElement;
        const contentNo = Number(row.dataset.contentNo);
        if (contentNo == contents.length) {
            contents = [...contents.slice(0, contentNo - 1)];
        } else {
            const before = contents.slice(0, contentNo - 1);
            const after = contents.slice(contentNo);
            after.forEach(x => x.no = Number(x.no) - 1);
            contents = [...before, ...after];
        }
    }


    async function handleClickSubmit(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (!confirm("登録しますか？")) {
            return;
        }

        const hasError = contents.find(x => x.error != false);
        if (hasError) {
            alert(JSON.stringify(hasError))
            return
        }

        try {
            const ret = await fetch("/api/issue/append", {
                method: "POST",
                body: JSON.stringify({
                    issueId,
                    magazineId: magazine,
                    title: magazineTitle,
                    coverUrl,
                    tocUrl,
                    description,
                    covers,
                    contents
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            goto(`/issue?magazine-id=${magazine}&year=${year}`);
        } catch (e) {
            alert(e.message);
        }
    }

    onMount(async () => {
        const params = $page.url.searchParams;
        magazine = params.get("magazine-id") ?? "WSMG";
        year = params.get("year") ?? "2024";
    })    

    export let data;

    let magazine = "WSMG";
    let year = "2024";
    let issue = "";
    let magazineTitle = "";
    let coverUrl = "";
    let tocUrl = "";
    let description = "";
    $: issueId = `${magazine}${year}${issue}`;

    let covers = [""];

    let contents = [
        { no: 1, titleId: null, title: "", pageNo: null, contentType: "1", isColor: false, serializationStatus: "", description: "", error: false },
        { no: 2, titleId: null, title: "", pageNo: null, contentType: "1", isColor: false, serializationStatus: "", description: "", error: false },
        { no: 3, titleId: null, title: "", pageNo: null, contentType: "1", isColor: false, serializationStatus: "", description: "", error: false },
        { no: 4, titleId: null, title: "", pageNo: null, contentType: "1", isColor: false, serializationStatus: "", description: "", error: false },
        { no: 5, titleId: null, title: "", pageNo: null, contentType: "1", isColor: false, serializationStatus: "", description: "", error: false }
     ];
</script>


<div class="page-container">
    <h1>New Issue</h1>
    <form on:submit={handleClickSubmit}>
        <div>
            <label for="magazine-id">ID :</label>
            <span id="magazine-id">{issueId}</span>
        </div>
        <div>
            <label for="magazine">タイトル :</label>
            <select id="magazine" bind:value={magazine}>
                {#each data.magazines as magazine}
                <option value={magazine.id}>{magazine.title}</option>
               {/each}        
            </select>    
        </div>
        <div>
            <label for="year">年度 :</label>
            <select id="year" bind:value={year}>
                <option value="2021">2021年</option>
                <option value="2022">2022年</option>
                <option value="2023" selected>2023年</option>
                <option value="2024">2024年</option>
            </select>    
        </div>
        <div>
            <label for="issue">号数 :</label>
            <input type="text" id="issue" bind:value={issue} > 
        </div>
        <div>
            <label for="magazine-title">タイトル :</label>
            <input type="text" id="magazine-title" bind:value={magazineTitle} > 
        </div>
        <div>
            <label for="covers0">表紙 :</label>
            <div>
                {#each covers as cover, i}
                <input type="text" id="covers{i}" list="titles" bind:value={cover} >
                {/each} 
                <button on:click={hadleClickAddCover}>追加</button>
            </div>
        </div>
        <div>
            <label for="cover-url">表紙画像URL :</label>
            <input type="text" id="cover-url" bind:value={coverUrl} >    
        </div>
        <div>
            <label for="toc-url">目次画像URL :</label>
            <input type="text" id="toc-url" bind:value={tocUrl} ><br>    
        </div>
        <div>
            <label for="description">摘要 :</label>
            <input type="text" id="description" bind:value={description} ><br>    
        </div>
        <div>
            <datalist id="titles">
                {#each data.titles as title}
                <option value={title.title}></option>
                {/each}
            </datalist>
            <table>
                <thead>
                    <tr>
                        <th class="col-no">No</th>
                        <th class="col-title">作品</th>
                        <th class="col-page">頁</th>
                        <th class="col-content-type">掲載種別</th>
                        <th class="col-color">Color</th>
                        <th class="col-serialization-status">連載状態</th>
                        <th class="col-description">備考</th>
                        <th class="col-buttons"></th>
                    </tr>
                </thead>
                <tbody>
                    {#each contents as content (content.no)}
                    <tr data-content-no={content.no}>
                        <td class="col-no">{content.no}</td>
                        <td class="col-title"><input type="text" list="titles" bind:value={content.title} on:change={HandleChangeTitle} /></td>
                        <td class="col-page"><input type="number" bind:value={content.pageNo} /></td>
                        <td class="col-content-type">
                            <select bind:value={content.contentType}>
                                <option value="0">読み切り</option>
                                <option value="1">連載</option>
                                <option value="2">出張掲載</option>
                            </select>
                        </td>
                        <td class="col-color">
                            <input type="checkbox" bind:checked={content.isColor} />
                        </td>
                        <td class="col-serialization_status">
                            <select bind:value={content.serializationStatus}>
                                <option value=""></option>
                                <option value="1">新連載</option>
                                <option value="2">連載中</option>
                                <option value="3">最終回</option>
                            </select>
                        </td>
                        <td class="col-description"><input type="text" bind:value={content.description} /></td>
                        <td class="col-buttons">
                            <button on:click={handleClickAddButton}>追加</button>
                            <button on:click={handleClickDelButton}>削除</button>
                        </td>
                    </tr>
                    {/each}        
                </tbody>
            </table>
        </div>
        <div class="buttons">
            <input type="submit" name="submit" value="登録">
        </div>
    </form>
    <div>
        <a href="/issue?magazine-id={magazine}&year={year}">戻る</a>
    </div>
</div>

<style>
    .page-container {
        margin: 1em 2em;
        width: 1100px;
    }
    form > div {
        margin-bottom: 5px;
    }
    form > div > label {
        display: inline-block;
        width: 150px;
    }
    form > div > input[type="text"] {
        width: 400px;
        padding: 0.5em 0.5em;
    }
    form > div > select {
        padding: 0.5em 0.5em;
    }
    form > div > div {
        display: inline-block;
    }
    form > div > div > input[type="text"] {
        width: 400px;
        padding: 0.5em 0.5em;
        display: block;
        margin-bottom: 5px;
    }
    form > div > div > input[type="text"]:last-of-type {
        display: inline-block;
        margin-bottom: 0;
    }
    form > div > table {
        margin-top: 1em;
        margin-bottom: 0.5em;
    }
    form > div > table > tbody > tr > td > input {
        padding: 0.5em 0.5em;        
    }
    form > div > table > tbody > tr > td > select {
        padding: 0.5em 0.5em;        
    }
    form > div > table > thead > tr > th {
        font-weight: normal;
    }
    form > div > table .col-title > input {
        width: 25em;
    }
    form > div > table .col-page > input {
        width: 3em;
    }
    form > div > table > tbody > tr > .col-color {
        text-align: center;
    }
    form > div > table .col-description > input {
        width: 20em;
    }
    form > div.buttons {
        text-align: right;
    }
    :global(.error) > td.col-title > input   {
        background-color: red;
    }
</style>