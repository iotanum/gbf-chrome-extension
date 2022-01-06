lastJoinStatus = {"joinStatus": []}

function tryJoiningRaid(url, payload) {
    let http = new XMLHttpRequest();
    http.open('POST', url, true);
    
    //Random website script to extract game version from
    let randomScript = (document.getElementsByTagName('script')[2].src).toString();
    let srcSplit = randomScript.split('/');
    let gameVersion = srcSplit[srcSplit.length - 3];

    http.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    http.setRequestHeader('X-VERSION', gameVersion);

    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {

            let success = parseResponse(http);

            if (success == true) {

                joinRaid(http);

            } else {
                joinStatus = {}
                joinStatus[payload['battle_key']] = success
                lastJoinStatus['joinStatus'].push(joinStatus)
                console.log('Failed:', success);
                sendUpdateToFE(lastJoinStatus)
            }
        }
    }

    http.send(JSON.stringify(payload));
};

function sendUpdateToFE(lastJoinStatus) {
    chrome.runtime.sendMessage(lastJoinStatus)
}

function TestRequestBulka(url) {
    let http = new XMLHttpRequest();
    http.open('GET', url, true);
    //Random website script to extract game version from
    let randomScript = (document.getElementsByTagName('script')[2].src).toString();
    let srcSplit = randomScript.split('/');
    let gameVersion = srcSplit[srcSplit.length - 3];

    http.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    // http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    http.setRequestHeader('X-VERSION', gameVersion);

    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {

            // console.log(lastJoinStatus)
        }
    }

    // http.send();
}

function joinRaid(response) {
    let jsonResponse = JSON.parse(response.responseText);
    let responseRedirect = jsonResponse['redirect'];

    TestRequestBulka(responseRedirect)
    window.location.href = responseRedirect

}

function parseResponse(response) {
    let jsonResponse = JSON.parse(response.responseText);
    
    if (jsonResponse['redirect']) {

        return true;

    } else if (jsonResponse['current_battle_point']) {

        console.log("Not enough EP!")
    } else {

        console.log(jsonResponse)
        return jsonResponse['popup']['body'];
    }
}
// console.log('Injection finished.');
//# sourceMappingURL=inject.js.map