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

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  let options = message.raid;
	console.log('Raid id', options.raidId);
	sendResponse('eik nx');
});