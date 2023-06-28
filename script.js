var ativado = false;
document.addEventListener("DOMContentLoaded", function (){
  var corBotaoP = document.getElementById("botaoProtanopia");
  var corBotaoD = document.getElementById("botaoDeuteranopia");
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
  corBotaoD.addEventListener("click", function (){
    ativado = !ativado;
    if(ativado){
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: mudaCorDeuteranopia, 
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
  var imagens = document.querySelectorAll("img");
  var videos = document.querySelectorAll("video");

  for (var i = 0; i < imagens.length; i++) {
    imagens[i].style.filter = "brightness(1.2) contrast(1.2)";
  }

  for (var j = 0; j < videos.length; j++) {
    videos[j].style.filter = "brightness(1.2) contrast(1.2)";
  }
  var elementos = document.querySelectorAll("*");
  for (var i = 0; i < elementos.length; i++){
    var estilo = getComputedStyle(elementos[i]);
    var cor = estilo.color;
    var corBG = estilo.getPropertyValue("background-color");

    if (cor.startsWith("rgb")) {
      var rgb = cor.match(/\d+/g);
      var vermelho = parseInt(rgb[0]);
      var verde = parseInt(rgb[1]);
      var azul = parseInt(rgb[2]);

      if(vermelho > 100 && verde < 70 && azul < 70){
        elementos[i].style.color = "red";
      }
      if(vermelho > 150 && verde < 100 && azul > 150){
        elementos[i].style.color = "#a45ee9";
      }
      if(vermelho < 100 && verde < 170 && azul > 100){
        elementos[i].style.color = "navy";
      }

      var rgbBG = corBG.match(/\d+/g);
      var vermelhoBG = parseInt(rgbBG[0]);
      var verdeBG = parseInt(rgbBG[1]);
      var azulBG = parseInt(rgbBG[2]);
    
      if(vermelhoBG > 100 && verdeBG < 70 && azulBG < 70){
        elementos[i].style.backgroundColor = "red";
      }
      if(vermelhoBG > 150 && verdeBG < 100 && azulBG > 150){
        elementos[i].style.backgroundColor = "#a45ee9";
      }
      if(vermelhoBG < 100 && verdeBG < 70 && azulBG > 80){
        elementos[i].style.backgroundColor = "navy";
      }
      if(vermelhoBG < 100 && verdeBG < 150 && azulBG > 170){
        elementos[i].style.backgroundColor = "blue";
      }
    }
  }
}
function mudaCorDeuteranopia(){
  var elementos = document.querySelectorAll("*")
  for (var i = 0; i < elementos.length; i++){
    elementos[i].style.filter = "brightness(1.01) contrast(1.02) hue-rotate(5deg)";
    }
  }
function desativa(){
  var elementos = document.getElementsByTagName("*");
  for(var i = 0; i < elementos.length; i++){
      elementos[i].style.color = "";
      elementos[i].style.backgroundColor = "";
      elementos[i].style.filter = "";
    }
}


