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
  var elementos = document.querySelectorAll("*");
  for (var i = 0; i < elementos.length; i++){
    var estilo = getComputedStyle(elementos[i]);
    var cor = estilo.color;
    var corBG = estilo.getPropertyValue("background-color")

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
      if(vermelho < 100 && verde < 170 && azul > 150){
        elementos[i].style.color = "navy";
      }
    }
    if(elementos[i].tagName.toLowerCase() === "nav" && corBG.startsWith("rgb")){
      var rgbBG = corBG.match(/\d+/g);
      var vermelhoBG = parseInt(rgbBG[0]);
      var verdeBG = parseInt(rgbBG[1]);
      var azulBG = parseInt(rgbBG[2]);
    
      if (vermelhoBG > 100 && verdeBG < 70 && azulBG < 70) {
        elementos[i].style.backgroundColor = "red";
      }
      if (vermelhoBG > 150 && verdeBG < 100 && azulBG > 150) {
        elementos[i].style.backgroundColor = "#a45ee9";
      }
      if (vermelhoBG < 100 && verdeBG < 170 && azulBG > 150) {
        elementos[i].style.backgroundColor = "navy";
      }
    }
  }
}


function desativa(){
  var elementos = document.getElementsByTagName("*");
  for(var i = 0; i < elementos.length; i++){
      elementos[i].style.color = "";
      if(elementos[i].tagName.toLowerCase() === "nav"){
        elementos[i].style.backgroundColor = "";
      } 
    }
}


