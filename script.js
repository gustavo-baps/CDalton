var ativadoP = false;

document.addEventListener("DOMContentLoaded", function(){
  var corBotaoP = document.getElementById("botaoProtanopia");
  var corBotaoD = document.getElementById("botaoDeuteranopia");

  corBotaoP.addEventListener("click", function(){
    ativadoP = !ativadoP;
    if(ativadoP){
      chrome.tabs.query({}, function(tabs){
        tabs.forEach(function(tab){
          chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: mudaCorProtanopia,
          });
        });
      });
    } 
    else{
      chrome.tabs.query({}, function(tabs){
        tabs.forEach(function(tab) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: desativaP,
          });
        });
      });
    }
  });

  var ativadoD = false;
  corBotaoD.addEventListener("click", function(){
    ativadoD = !ativadoD;
    if(ativadoD){
      chrome.tabs.query({}, function(tabs){
        tabs.forEach(function(tab){
          chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: mudaCorDeuteranopia,
          });
        });
      });
    } 
    else{
      chrome.tabs.query({}, function(tabs){
        tabs.forEach(function(tab) {
          chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: desativaD,
          });
        });
      });
    }
  });
});

function mudaCorProtanopia(){
  var imagens = document.querySelectorAll("img");
  var videos = document.querySelectorAll("video");

  for(var i = 0; i < imagens.length; i++){
    imagens[i].style.filter = "brightness(1.2) contrast(1.2)";
  }

  for(var j = 0; j < videos.length; j++){
    videos[j].style.filter = "brightness(1.2) contrast(1.2)";
  }

  var elementos = document.querySelectorAll("*");
  for(var i = 0; i < elementos.length; i++){
    var estilo = getComputedStyle(elementos[i]);
    var cor = estilo.color;
    var corBG = estilo.getPropertyValue("background-color");

    if(cor.startsWith("rgb")){
      var rgb = cor.match(/\d+/g);
      var vermelho = parseInt(rgb[0]);
      var verde = parseInt(rgb[1]);
      var azul = parseInt(rgb[2]);

      if(vermelho > 170 && verde < 70 && azul < 70){
        elementos[i].style.color = "red";
      }
      if(vermelho > 150 && verde < 100 && azul > 150){
        elementos[i].style.color = "#a45ee9";
      }
      if(vermelho < 100 && verde < 170 && azul > 100){
        elementos[i].style.color = "navy";
      }

      if(corBG.startsWith("rgb")){
        elementos[i].style.filter = "hue-rotate(2.3deg)";
      }
    }
  }
}

function mudaCorDeuteranopia(){
  var elementos = document.querySelectorAll("*");
  for(var i = 0; i < elementos.length; i++){
    elementos[i].style.filter = "hue-rotate(2.3deg)";
  }
}

function desativaP(){
  var elementos = document.getElementsByTagName("*");
  for (var i = 0; i < elementos.length; i++){
    elementos[i].style.color = "";
    elementos[i].style.filter = "";
  }
}

function desativaD(){
  var elementos = document.getElementsByTagName("*");
  for(var i = 0; i < elementos.length; i++){
    elementos[i].style.filter = "";
  }
}
