const searchInput = document.getElementById("searchBar")
const searchInputSuggestions = document.getElementById("searchBarSuggestion")
let inputText = ""
let bossList = []
let fullRaidList = []
let bossListSuggestion = []
let activeSuggestion = -1


document.getElementById("searchBar").onkeydown = (e) => {
    const input = document.getElementById("searchBar")
    if (e.code === 'ArrowDown' && activeSuggestion < bossListSuggestion.length - 1) 
    {
        if (activeSuggestion >= 0) document.getElementById('searchBarSuggestion').getElementsByTagName('button')[activeSuggestion].classList.remove('active')
        activeSuggestion++
        document.getElementById('searchBarSuggestion').getElementsByTagName('button')[activeSuggestion].classList.add('active')
        input.value = document.getElementById('searchBarSuggestion').getElementsByTagName('li')[activeSuggestion].innerHTML
        inputText = input.value
    }
    if (e.code === 'ArrowUp' && activeSuggestion > 0) 
    {
        document.getElementById('searchBarSuggestion').getElementsByTagName('button')[activeSuggestion].classList.remove('active')
        activeSuggestion--
        document.getElementById('searchBarSuggestion').getElementsByTagName('button')[activeSuggestion].classList.add('active')
        input.value = document.getElementById('searchBarSuggestion').getElementsByTagName('li')[activeSuggestion].innerHTML
        inputText = input.value
        if (typeof input.selectionStart == "number") {
            input.selectionStart = input.selectionEnd = input.value.length;
        } else if (typeof input.createTextRange != "undefined") {
            input.focus();
            var range = input.createTextRange();
            range.collapse(false);
            range.select();
        }
    }
    if (e.code === 'Enter') {
        console.log(swx)
        handleBossRequest(inputText)
    }

    
    console.log(e)
}

function handleBossRequest(boss) {
    bossIdList = []
    lstn.innerHTML = ''
    if (bossList.includes(boss))
    {
        bossListSuggestion = [];
        document.getElementById('searchBarSuggestion').innerHTML = '';
        getBossRaids(boss);
        document.getElementById("searchBar").blur()
    }
}

searchInput.oninput = () => {
    inputText = searchInput.value;
    bossListSuggestion = []
    document.getElementById('searchBarSuggestion').innerHTML = ''
    if (inputText.length > 1 && bossList.length > 0) {
        activeSuggestion = -1
        let listItemsCount = 0
            bossListSuggestion.push(`<button><li>${inputText}</li></button>`)
            bossList.map(item => {
            console.log(item.toLowerCase())
            if (item.toLowerCase().includes(inputText.toLowerCase()))
            {
                if (listItemsCount < 5) 
                {
                    bossListSuggestion.push(`<button><li>${item}</li></button>`)
                }
                listItemsCount++
            }
            document.getElementById('searchBarSuggestion').innerHTML = bossListSuggestion.join('')
            
        })
        let buttonsList = document.getElementById('searchBarSuggestion').getElementsByTagName("button")
        for (let button of buttonsList) {

            button.onclick = () => {
                let suggestionBossName = button.getElementsByTagName('li')[0].innerHTML
                document.getElementById("searchBar").value = suggestionBossName
                handleBossRequest(suggestionBossName)
            }

        }
    }
    console.log(inputText)
}

