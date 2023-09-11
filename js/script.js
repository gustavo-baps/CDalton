var ativadoP = false;

document.addEventListener("DOMContentLoaded", function(){
  var corBotaoP = document.getElementById("botaoProtanopia");
  var corBotaoD = document.getElementById("botaoDeuteranopia");
  var corBotaoT = document.getElementById("botaoTritanopia");
  

  corBotaoP.addEventListener("click", function(){
    ativadoP = !ativadoP;
    corBotaoD.setAttribute('style', "background-color: #D9D9D9");
    corBotaoP.setAttribute('style', 'background-color: #656565');
    corBotaoT.setAttribute('style', "background-color: #D9D9D9");
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
      corBotaoP.setAttribute('style', 'background-color: #D9D9D9');
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
    corBotaoP.setAttribute('style', "background-color: #D9D9D9");
    corBotaoD.setAttribute('style', 'background-color: #656565');
    corBotaoT.setAttribute('style', "background-color: #D9D9D9")
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
      corBotaoD.setAttribute('style', 'background-color: #D9D9D9');
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
  var ativadoT = false;
  corBotaoT.addEventListener("click", function(){
    ativadoT = !ativadoT;
    corBotaoD.setAttribute('style', "background-color: #D9D9D9");
    corBotaoP.setAttribute('style', 'background-color: #D9D9D9');
    corBotaoT.setAttribute('style', 'background-color: #656565');
    if(ativadoT){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        tabs.forEach(function(tab){
          chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: mudaCorTritanopia,
          });
        });
      });
    } 
    else{
      corBotaoT.setAttribute('style', 'background-color: #D9D9D9');
    }
  });
  
}); 
function mudaCorTritanopia() {
  var elementos = document.querySelectorAll("*");
  for (var i = 0; i < elementos.length; i++) {
    elementos[i].addEventListener("click", capturarClique, { once: true });
  }

  async function capturarClique(event) {
    var alvo = event.target;
    var style = getComputedStyle(alvo);
    var bgColor = style.backgroundColor;
    var rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (rgbMatch) {
      var colorRGB = rgbMatch.slice(1).map(value => parseInt(value, 10));

      getColorName(colorRGB).then(colorName => {
        console.log("cor em RGB: ", colorRGB.join(", "));
        console.log("Nome da cor: ", colorName);
      });
    } else {
      console.error("nao foi possível extrair a cor");
    }
  }
  async function getColorName(rgb) {
    var stringRgb = rgb.join(",");
    var apiUrl = `https://www.thecolorapi.com/id?rgb=${stringRgb}`;
    try {
      var resp = await fetch(apiUrl);
      var data = await resp.json();
      if (resp.ok) {
        return data.name.value || "Unknown";
      } else {
        console.error('erro na resposta da api: ', data);
        return "Unknown";
      }
    } catch (error) {
      console.error('erro: ', error);
      return 'unknown';
    }
  }
}
function mudaCorProtanopia() {
  var elementos = document.querySelectorAll("*");

  for (var i = 0; i < elementos.length; i++){
    var estilo = getComputedStyle(elementos[i]);
    var cor = estilo.color;
    var corBG = estilo.getPropertyValue("background-color");
    if (!elementos[i].querySelector("img") && !elementos[i].querySelector("video")){
      if (cor.startsWith("rgb")) {
        var rgb = cor.match(/\d+/g);
        var vermelho = parseInt(rgb[0]);
        var verde = parseInt(rgb[1]);
        var azul = parseInt(rgb[2]);

        if (vermelho > verde && vermelho > azul){
          elementos[i].style.filter = "hue-rotate(15deg) saturate(1.2)";
        }
      }
      if (corBG.startsWith("rgb")){
        var rgbBG = corBG.match(/\d+/g);
        var vermelhoBG = parseInt(rgbBG[0]);
        var verdeBG = parseInt(rgbBG[1]);
        var azulBG = parseInt(rgbBG[2]);

        if (vermelhoBG > verdeBG && vermelhoBG > azulBG){
          elementos[i].style.filter = "hue-rotate(15deg) saturate(1.2)";
        }
      }
    }
    else{
      elementos[i].style.filter = "brightness(1.005) hue-rotate(2deg)";
    }
  }
}


function mudaCorDeuteranopia(){
  var elementos = document.querySelectorAll("*");

  for (var i = 0; i < elementos.length; i++){
    var estilo = getComputedStyle(elementos[i]);
    var cor = estilo.color;
    var corBG = estilo.getPropertyValue("background-color");
    if (!elementos[i].querySelector("img") && !elementos[i].querySelector("video")){
      if (cor.startsWith("rgb")) {
        var rgb = cor.match(/\d+/g);
        var vermelho = parseInt(rgb[0]);
        var verde = parseInt(rgb[1]);
        var azul = parseInt(rgb[2]);

        if (verde > vermelho && verde > azul){
          elementos[i].style.filter = "hue-rotate(15deg) saturate(1.2)";
        }
      }
      if (corBG.startsWith("rgb")){
        var rgbBG = corBG.match(/\d+/g);
        var vermelhoBG = parseInt(rgbBG[0]);
        var verdeBG = parseInt(rgbBG[1]);
        var azulBG = parseInt(rgbBG[2]);

        if (verdeBG > vermelhoBG && verdeBG > azulBG){
          elementos[i].style.filter = "hue-rotate(15deg) saturate(1.2)";
        }
      }
    }
    else{
      elementos[i].style.filter = "brightness(1.005) hue-rotate(2deg)";
    }
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