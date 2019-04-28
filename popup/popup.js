const buttonOnclick = (raidId) => () => {
    // chrome.tabs.executeScript({code: 'console.log("comeON")'});
    chrome.runtime.sendMessage({raid: raidId}, function(response) {
        console.log(response);
    })
    let payload = { special_token: null, battle_key: raidId };

    console.log("vykdo ir px")
    chrome.tabs.executeScript({code: `tryJoiningRaid("/quest/battle_key_check", ${JSON.stringify(payload)});`});

};