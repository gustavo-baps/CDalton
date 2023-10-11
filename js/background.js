chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    if(request.message === "capturaClique"){
        chrome.tabs.captureVisibleTab({ format: "png" }, function (dataUrl){
            sendResponse({ imageDataUrl: dataUrl });
        });
        return true; // Permite a execução assíncrona
    }
    return false; // Não precisa de uma resposta para mensagens diferentes de "capturaClique"
});