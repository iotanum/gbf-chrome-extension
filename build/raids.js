let lstn = document.querySelector(".raids-ul");

let intervalID = ''
let raidListUrl = "http://localhost:9000/getlist"
let backend = "http://localhost:9000/raid?="
let isFetching = false
let bossIdList = []
getAllBosses()

function getBossRaids(boss) {
    if (!isFetching) {
        isFetching = true
        let http = new XMLHttpRequest();
        http.open('GET', backend + boss, true);
        
        http.onreadystatechange = function() {
            if (http.readyState == XMLHttpRequest.DONE) {

                let response = JSON.parse(http.responseText);
                console.log(response)
                for (i in response) {
                    if (!bossIdList.includes(i))
                    {
                        if (bossIdList.length > 4)
                        {
                            bossIdList.shift()
                            lstn.removeChild(lstn.getElementsByTagName("button")[0])
                        }
                        bossIdList.push(i)
                        let button = document.createElement("button");
                        let listItem = document.createElement("li");
                        let spanNodeFirst = document.createElement("span");
                        let spanNodeSecond = document.createElement("span");
                        spanNodeFirst.innerHTML = i
                        spanNodeSecond.innerHTML = response[i]
                        button.appendChild(listItem);
                        listItem.appendChild(spanNodeFirst);
                        listItem.appendChild(spanNodeSecond);
                        lstn.appendChild(button);
                        button.onclick = buttonOnclick(i)
                    }
                }
            }
            isFetching = false
        };

        http.send();
    }
};
function getAllBosses() {
    let http = new XMLHttpRequest();
    http.open('GET', raidListUrl, true);
    
    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {

            let response = JSON.parse(http.responseText);
            bossList = response.list 
            console.log(bossList)
        }
    };

    http.send();
};