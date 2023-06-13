document.addEventListener("DOMContentLoaded", function () {
  var corBotao = document.getElementById("botao");
  corBotao.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: mudaCorTexto,
      });
    });
  });
});

function mudaCorTexto() {
  document.body.style.color = "yellow";
}