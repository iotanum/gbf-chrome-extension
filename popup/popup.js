let searchButton = document.querySelector('.raid-search-btn');

searchButton.onclick = function() {
    let raidId = document.querySelector('.raid-id-input').value;

    // chrome.tabs.executeScript({code: 'console.log("comeON")'});
    chrome.runtime.sendMessage({raid: raidId}, function(response) {
        console.log(response);
    })
    var payload = { special_token: null, battle_key: raidId };

    chrome.tabs.executeScript({code: 
        'var payload = ' + JSON.stringify(payload) + ';'}, function() {
            chrome.tabs.executeScript({code: 'var url = "/quest/battle_key_check";'}, function() {
                chrome.tabs.executeScript({code: 'tryJoiningRaid(url, payload);'});
            })
        });
};