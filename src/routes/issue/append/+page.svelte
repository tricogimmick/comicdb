<script>
    // @ts-nocheck

    function newEpisode(no) {
        return {
            no,
            titleId: null,
            title: "",
            pageNo: null,
            serialization: "0",
            isColor: false,
            notice: "",
            error: false
        };
    }

    function HandleChangeTitle(e) {
        const row = this.parentElement.parentElement;
        const episodeNo = row.dataset.episodeNo;
        const episode = episodes[episodeNo -1];
        const title = data.titles.find(x => x.title == this.value);
        if (title) {
            episode.titleId = title.id;
            episode.error = false;
            row.classList.remove("error")
        } else {
            episode.titleId = null;
            episode.error = true;
            row.classList.add("error")
        }
        console.log(episode);
    }

    function handleClickAddButton() {
        const no = episodes.length + 1;
        episodes = [...episodes, newEpisode(no)];
    }

    async function handleClickSubmit(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const hasError = episodes.find(x => x.error != null);
        if (hasError) {
            alert("エラー!")
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
                    episodes
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await ret.json();
            console.log(data);
        } catch (e) {
            alert(e.message);
            return
        }
    }

    export let data;

    let magazine = "WSMG";
    let year = "2023";
    let issue = "";
    let magazineTitle = "";
    let coverUrl = "";
    let tocUrl = "";
    $: issueId = `${magazine}${year}${issue}`;

    let episodes = [
        { no: 1, titleId: null, title: "", pageNo: null, serialization: "0", isColor: false, notice: "", error: false },
        { no: 2, titleId: null, title: "", pageNo: null, serialization: "0", isColor: false, notice: "", error: false },
        { no: 3, titleId: null, title: "", pageNo: null, serialization: "0", isColor: false, notice: "", error: false },
        { no: 4, titleId: null, title: "", pageNo: null, serialization: "0", isColor: false, notice: "", error: false },
        { no: 5, titleId: null, title: "", pageNo: null, serialization: "0", isColor: false, notice: "", error: false }
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
            <label for="cover-url">表紙画像URL :</label>
            <input type="text" id="cover-url" bind:value={coverUrl} >    
        </div>
        <div>
            <label for="toc-url">目次画像URL :</label>
            <input type="text" id="toc-url" bind:value={tocUrl} ><br>    
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
                        <th class="col-serialization">掲載種別</th>
                        <th class="col-color">Color</th>
                        <th class="col-notice">備考</th>
                    </tr>
                </thead>
                <tbody>
                    {#each episodes as episode (episode.no)}
                    <tr data-episode-no={episode.no}>
                        <td class="col-no">{episode.no}</td>
                        <td class="col-title"><input type="text" list="titles" bind:value={episode.title} on:change={HandleChangeTitle} /></td>
                        <td class="col-page"><input type="number" bind:value={episode.pageNo} /></td>
                        <td class="col-serialization">
                            <select bind:value={episode.serialization}>
                                <option value="0">読み切り</option>
                                <option value="1">連載</option>
                                <option value="2">出張掲載</option>
                            </select>
                        </td>
                        <td class="col-color">
                            <input type="checkbox" bind:checked={episode.isColor} />
                        </td>
                        <td class="col-notice"><input type="text" bind:value={episode.notice} /></td>
                    </tr>
                    {/each}        
                </tbody>
            </table>
            <div>
                <button on:click={handleClickAddButton}>行追加</button>
            </div>
        </div>
        <div class="buttons">
            <input type="submit" name="submit" value="登録">
        </div>
    </form>
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
        width: 150px;
    }
    form > div > input[type="text"] {
        width: 400px;
        padding: 0.5em 0.5em;
    }
    form > div > select {
        padding: 0.5em 0.5em;
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
        width: 20em;
    }
    form > div > table .col-page > input {
        width: 5em;
    }
    form > div > table > tbody > tr > .col-color {
        text-align: center;
    }
    form > div > table .col-notice > input {
        width: 20em;
    }
    form > div.buttons {
        text-align: right;
    }
    :global(.error) > td.col-title > input   {
        background-color: red;
    }
</style>