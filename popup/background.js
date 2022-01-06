chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
			pageUrl: {hostEquals: 'game.granbluefantasy.jp'},
			})
        ],
			actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
		});
});

// messages from page itself
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.log(message, "the message")
	if (message['joinStatus']) {
		sendStatusToExtension(message)
	}
	sendResponse(true);
});

// send messages from chrome runtime to extension
function sendStatusToExtension(status) {
	chrome.runtime.sendMessage(status);
}
