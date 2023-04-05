
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.greeting == 'download'){
        var filename_tail = message.url.substring(message.url.lastIndexOf("/") + 1);
        chrome.downloads.download({url:message.url,filename:'midjourney/'+message.keyword+'/'+message.filename+filename_tail});
    }
});