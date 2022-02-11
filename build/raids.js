let lstn = document.querySelector(".raids-ul");
let autoJoinDiv = document.querySelector(".auto-join-wrapper")

let intervalID = ''
let webSocketsUrl = "wss://gbf-raidfinder-tw.herokuapp.com/ws/raids?keepAlive=true"
let bossIdList = []
let decodedFile = {}
let initialSummonListIdentifier = "0.3.7"
counter = 1
let autoJoinHidden = true
getAllBosses()
getAllDecodedRaids()

function getAllDecodedRaids() {
    file = fetch('../build/decoded.txt').then(response => {
        response.text().then(message => {
            const splitLines = message.split(/\r?\n/);
            for (let line of splitLines) {
                line = line.split(";")
                raidName = line[2]
                decodedFile[raidName] = [line[0], line[1]]
            }
        })
    })
};

function getRaidIds(wsMsg) {
    var id = ""
    const splitLines = wsMsg.split(/\r?\n/);
    for (let line of splitLines) {
        line = line.toString().split("\x12\b")
        
        if (line.length >= 2) {
            raidId = line[1].split("\x1A");
            id = raidId[0]
        }
    }

    return id;
}

function getBossRaids(boss) {
    let nihongoName = getNihongoBossName(boss);
    let connection = new WebSocket(webSocketsUrl, "binary");


    // add event listener reacting when message is received
    connection.onmessage = function (event) {
        event.data.text().then(message => {
            // wait for connection to be established and send a request for a full summon list
            if (message.includes(initialSummonListIdentifier)) {
                // Padding for raid boss msg
                var padding = decodedFile[nihongoName][0]
                var raidInHex = decodedFile[nihongoName][1]
                padding = new Uint8Array(padding.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                raidInHex = new Uint8Array(raidInHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

                var fullMsg = new Uint8Array(padding.length + raidInHex.length)
                fullMsg.set(padding);
                fullMsg.set(raidInHex, padding.length)
                connection.send(fullMsg);
            };

            if (message.includes(boss) || message.includes(nihongoName)) {
                let raidId = getRaidIds(message);
                console.log(raidId, boss)
                updateGUIList(raidId)
            };
        });
    };
};

function updateGUIList(raidId) {
    if (raidId === "") {
        return
    }

    if (bossIdList.length > 4)
    {
        bossIdList.pop()
        lstn.removeChild(lstn.getElementsByTagName("button")[4])

        // refresh everyone's index in the list displayed
        for (let btn of lstn.getElementsByTagName("button")) {
            let btnSpanNodeFirst = btn.getElementsByTagName("span")[0]
            let btnSpanNodeSecond = btn.getElementsByTagName("span")[1]
            raidIdFromClass = btnSpanNodeSecond.classList[0]
            btnSpanNodeFirst.innerHTML = bossIdList.indexOf(raidIdFromClass) + 2
        }
    }
    bossIdList.unshift(raidId)

    // raid button creation
    let button = document.createElement("button");
    let listItem = document.createElement("li");
    let spanNodeFirst = document.createElement("span");
    spanNodeFirst.classList.add('numOrder')
    let spanNodeSecond = document.createElement("span");
    const raidNumInList = bossIdList.indexOf(raidId) + 1
    spanNodeFirst.innerHTML = raidNumInList
    spanNodeSecond.innerHTML = raidId
    spanNodeSecond.classList.add(raidId ? raidId : 1)

    // some logic to get the raids to the top of the list
    // create the element first
    button.appendChild(listItem);
    listItem.appendChild(spanNodeFirst);
    listItem.appendChild(spanNodeSecond);
    // prepend if there's an existing list or append if there's no list (extension start)
    if (lstn.getElementsByTagName("button").length > 1) {
        lstn.prepend(button)
    } else {
        lstn.appendChild(button)
    }

    // unhide auto-join checkbox upon displaying raids
    if (autoJoinHidden === true) {
        autoJoinHidden = false
        autoJoinDiv.classList.remove("hidden")
    }

    button.onclick = buttonOnclick(raidId)

    // if auto-join is checked - enter the first raid after an update
    if (document.getElementById('auto-join').checked) {
        let btn = lstn.getElementsByTagName("button")[0]
        btn.onclick()
        autoJoinHidden = true
        document.getElementById('auto-join').checked = false
    }
}

function getNihongoBossName(boss) {
    for (let raid of fullRaidList) {
        if (boss === raid[0]) {
            return raid[1];
        };
    };
};


function cleanMessage(input) {
    let summonList = []
    swx = "swxall"
    const splitLines = input.split(/\r?\n/);
    for (let line of splitLines) {
        const possiblePrefixes = ["Lv", "htt"]
        // check if any of the prefixes are in a line
        if (possiblePrefixes.some(el => line.includes(el))) {
            line = line.trim();

            if (line.includes("Lv")) {
                if (!line.startsWith("Lv")) {
                    line = line.substring(1);
                };

                if (line.endsWith("1")) {
                    line = line.substring(0, line.length - 2);
                };
            }

            if (line.includes("http")) {
                line = "";
            };
        };

        if (4 >= line.length >= 1) {
            line = "";
        };

        // qilin and huang specific cleanup
        if (line.includes("Huanglong & Qilin") || line.includes("HL")) {
            line = line.substring(1);
            if (line.endsWith("1")) {
                line = line.substring(0, line.length - 2)
            }
        };

        // four primarch specific cleanup
        if (line.includes("The Four Primarchs") || line.includes("ＨＬ")) {
            line = line.substring(1)
            if (line.endsWith("1")) {
                line = line.substring(0, line.length - 2)
            }
        }

        if (line === "") {
            continue;
        };

        summonList.push(line)
    };

    return summonList;
};

function groupAndRemoveMultiples(input) {
    counter = 0
    raidSubList = []
    raidList = []

    // group given list to an array [eng_name, jp_name]
    for (let line of input) {
        counter = 1 + counter

        if (counter <= 2) {
            raidSubList.push(line);
        } else {
            counter = 1;
            raidList.push(raidSubList);
            raidSubList = [];
            raidSubList.push(line);
        };
    };

    // if there's nihongo in the first element of array -> put in in the 2nd index of array
    nihongoRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/
    for (let raid of raidList) {
        if (nihongoRegex.test(raid[0])) {
            var index = raidList.indexOf(raid)
            var el = raid[1]
            raidList[index][1] = raidList[index][0]
            raidList[index][0] = el
        }
    };

    // remove duplicates
    raidList = Array.from(new Set(raidList.map(JSON.stringify)), JSON.parse)

    // sort by lvl, starting from just words
    var numberPattern = /\d+/g;
    raidList = raidList.sort((a, b) => b[0].match(numberPattern) - a[0].match(numberPattern))

    return raidList;
};

function addRaids(raidList) {
    raidListCopy = []
    for (let raid of raidList) {
        raidListCopy.push(raid[0]);
    };

    bossList = raidListCopy
};

function getAllBosses() {
    let connection = new WebSocket(webSocketsUrl, "binary");

    // add event listener reacting when message is received
    connection.onmessage = function (event) {
        // await and decode hexadecimal msgs
        event.data.text().then(message => {
            // wait for connection to be established and send a request for a full summon list
            if (message.includes(initialSummonListIdentifier)) {
                let summonList = new Uint8Array([0x0A, 0x00])
                connection.send(summonList);

            // every other message should be handled here
            } else {
                // parse full list of summons
                if (message.includes("Lucilius")) {
                    let cleanedMsg = cleanMessage(message);
                    let raidList = groupAndRemoveMultiples(cleanedMsg);
                    console.log(raidList);
                    fullRaidList = raidList;
                    addRaids(raidList);
                };
            };
        });
    };
};
