var lstn = document.querySelector(".raids-ul");
var node = document.createElement("LI");
var textNode = document.createTextNode("Raid! :P");
node.appendChild(textNode);

lstn.appendChild(node);
// getRaids();

// function getRaids() {
//     var http = new XMLHttpRequest();
//     var url = "gbf-raidfinder.aikats.us";
//     var corsHack = "https://cors-anywhere.herokuapp.com/"

//     http.open("GET", corsHack + url, true);
//     if (http.readyState == XMLHttpRequest.DONE) {
//         console.log(http.responseText);
//     }
//     http.send(null);
// }