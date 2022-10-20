const interceptScript = document.createElement('script');
interceptScript.setAttribute("type","module");

interceptScript.src = chrome.runtime.getURL('inject.js');
document.head.prepend(interceptScript);

chrome.runtime.onMessage.addListener(msg => {
    if (msg.to === 'content') {
        postMessage({...msg, to: 'inject'});
    }
  });