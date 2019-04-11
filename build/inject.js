function tryJoiningRaid(url, payload) {
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    
    //Random website script to extract game version from
    var randomScript = (document.getElementsByTagName('script')[2].src).toString();
    var srcSplit = randomScript.split('/');
    var gameVersion = srcSplit[srcSplit.length - 3];

    http.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    http.setRequestHeader('X-VERSION', gameVersion);

    http.onreadystatechange = function() {
        if (http.readyState == XMLHttpRequest.DONE) {

            var success = parseResponse(http);

            if (success == true) {

                joinRaid(http);

            } else {

                console.log('Failed:', success);

            }
        }
    }

    http.send(JSON.stringify(payload));
};

function joinRaid(response) {
    var jsonResponse = JSON.parse(response.responseText);
    var responseRedirect = jsonResponse['redirect'];

    window.location.href = responseRedirect

}

function parseResponse(response) {
    var jsonResponse = JSON.parse(response.responseText);
    
    if (jsonResponse['redirect']) {

        return true;

    } else {

        return jsonResponse['popup']['body'];

    }
}
console.log('Injection finished.');
//# sourceMappingURL=inject.js.map