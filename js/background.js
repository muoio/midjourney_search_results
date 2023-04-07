
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    if (message.greeting == 'download'){
    //     var filename_tail = message.url.substring(message.url.lastIndexOf("/") + 1);
    //     chrome.downloads.download({url:message.url,filename:'midjourney/'+message.keyword+'/'+message.filename+filename_tail},sendResponse);
    // }

    const downloadOptions = {
      url: message.url,
      filename: 'midjourney/'+message.keyword+'/'+message.filename,
      saveAs:false,
      conflictAction: 'uniquify'
    };
    const downloadId = await new Promise((resolve, reject) => {
      chrome.downloads.download(downloadOptions, (downloadId) => {
        if (chrome.runtime.lastError) {
          reject({msg:chrome.runtime.lastError});
        } else {
          resolve({msg:downloadId});
          console.log('filename ',downloadOptions.filename);
        }
      });
    });
    sendResponse(downloadId);
    return true;
  }
});


let lifeline;

keepAlive();

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'keepAlive') {
    lifeline = port;
    setTimeout(keepAliveForced, 1000*10); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
  if (lifeline) return;
  for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => chrome.runtime.connect({ name: 'keepAlive' }),
        // `function` will become `func` in Chrome 93+
      });
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(tabId, info, tab) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
}