var ativado = false;
document.addEventListener("DOMContentLoaded", function (){
  var corBotaoP = document.getElementById("botaoProtanopia");
  corBotaoP.addEventListener("click", function (){
    ativado = !ativado;
    if(ativado){
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: mudaCorProtanopia,
        });
      });
    }
    else{
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: desativa,
        });
      });
    }
  });
});

function mudaCorProtanopia(){
  var elementos = document.getElementsByTagName("*");
  for (var i = 0; i < elementos.length; i++) {
    var cor = window.getComputedStyle(elementos[i]).color;
    var hex = cor.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
    var vermelho = parseInt(hex[0]);
    var verde = parseInt(hex[1]);
    var azul = parseInt(hex[2]);

    if(vermelho > 150 && verde < 100 && azul < 100){
      elementos[i].style.color = "red";
    }

    if(vermelho > 150 && verde < 100 && azul > 150){
      elementos[i].style.color = "#a45ee9";
    }

    if(vermelho < 100 && verde < 100 && azul > 150){
      elementos[i].style.color = "navy";
    }
  }
}

function desativa(){
  var elementos = document.getElementsByTagName("*");
  for (var i = 0; i < elementos.length; i++) {
      elementos[i].style.color = ""; 
    }
}


