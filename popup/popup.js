// listen to messages from chrome runtime
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request['joinStatus']) {
            UpdateRaidStatusButton(request['joinStatus'])
        }
    }
);

function UpdateRaidStatusButton(joinStatus) {
    for (let raidIdAndStatus of joinStatus) {
        let raidId = Object.keys(raidIdAndStatus)[0]
        console.log(raidId, raidIdAndStatus, "findAndUpdateRaidStatus")
        let statusMsg = parseRaidStatus(raidId, raidIdAndStatus[raidId])

        for (let btn of document.getElementsByTagName('button')) {
            let btnSpanNodeFirst = btn.getElementsByTagName("span")[0]
            let btnSpanNodeSecond = btn.getElementsByTagName("span")[1]
            if (btnSpanNodeSecond.innerHTML === raidId) {
                btnSpanNodeSecond.innerHTML = statusMsg
            }
        }
  }
}

function parseRaidStatus(raidId, joinStatus) {
    if (joinStatus.includes('full')) {
        return 'Raid is full.'
    } else if (joinStatus.includes('ended')) {
        return 'Raid is ended.'
    } else if (joinStatus.includes("doesn't")) {
        return "Raid too old."
    } else {
        return "Unknown reason."
    }
}

function updateSelectedButtons(raidId) {
    for (let btn of document.getElementsByTagName('button')) {
        let btnSpanNodeFirst = btn.getElementsByTagName("span")[0]
        let btnSpanNodeSecond = btn.getElementsByTagName("span")[1]
        if (btnSpanNodeSecond.innerHTML === raidId) {
            btn.classList.add('selected')
        }
    }
}

const buttonOnclick = (raidId) => () => {
    updateSelectedButtons(raidId)

    chrome.runtime.sendMessage({raid: raidId}, function(response) {
        console.log(response, 120);
    })
    let payload = { special_token: null, battle_key: raidId };

    chrome.tabs.executeScript({code: `tryJoiningRaid("/quest/battle_key_check", ${JSON.stringify(payload)});`});
};
