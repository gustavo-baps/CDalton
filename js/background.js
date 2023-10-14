chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    if(request.message === "capturaClique"){
        chrome.tabs.captureVisibleTab({ format: "png" }, function (dataUrl){
            sendResponse({ imageDataUrl: dataUrl });
        });
        return true;
    }
    return false;
});