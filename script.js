document.addEventListener("DOMContentLoaded", function () {
  var corBotao = document.getElementById("botao");
  corBotao.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: mudaCorTexto,
      });
    });
  });
});

function mudaCorTexto() {
  var elementos = document.querySelectorAll("*");
  for(var i = 0; i < elementos.length; i++){
    elementos[i].style.color = "yellow";
  }
}