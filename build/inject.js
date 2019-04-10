function tryJoiningRaid(url, payload) {
    var http = new XMLHttpRequest();
    http.open('POST', url, true);

    http.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    http.setRequestHeader('X-VERSION', '1554462529');

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