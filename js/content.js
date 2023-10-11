var ativadoP = false;
function capturarCliqueNaPagina(){
  chrome.runtime.sendMessage({ message: "capturaClique" }, function (response){
    const imageDataUrl = response.imageDataUrl;

    const img = new Image();
    img.src = imageDataUrl;

    img.onload = function (){
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");

        context.drawImage(img, 0, 0, img.width, img.height);

        if(!document._clickListenerAdded){
          document._clickListenerAdded = true;

          document.addEventListener("click", function (event){
              const x = event.clientX;
              const y = event.clientY;

              const pixelData = context.getImageData(x, y, 1, 1).data;
              const cor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;

              alert("cor clicada: "+cor)
              console.log("Cor do pixel clicado:", cor);
          });
      }
    };
  });
}


document.addEventListener("DOMContentLoaded", function (){
  var corBotaoP = document.getElementById("botaoProtanopia");
  var corBotaoD = document.getElementById("botaoDeuteranopia");
  var corBotaoT = document.getElementById("botaoTritanopia");

  corBotaoP.addEventListener("click", function (){
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

    chrome.runtime.sendMessage({ message: "mudaCorProtanopia", ativadoP: ativadoP });
  });
  var ativadoD = false;
  corBotaoD.addEventListener("click", function (){
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
  corBotaoT.addEventListener("click", function (){
    ativadoT = !ativadoT;
    corBotaoD.setAttribute('style', "background-color: #D9D9D9");
    corBotaoP.setAttribute('style', 'background-color: #D9D9D9');
    corBotaoT.setAttribute('style', 'background-color: #656565');
    if(ativadoT){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        tabs.forEach(function(tab){
          chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: capturarCliqueNaPagina,
          });
        });
      });
    } 
    else{
      corBotaoT.setAttribute('style', 'background-color: #D9D9D9');
    }
  });
 

/*function mudaCorTritanopia(){
  var elementos = document.querySelectorAll("*");
  for (var i = 0; i < elementos.length; i++){
    elementos[i].addEventListener("click", capturarClique);

    var links = elementos[i].querySelectorAll("a");
    for(var j = 0; j < links.length; j++){
      links[j].addEventListener("click", bloquearClique);
    }
  }

  async function capturarClique(event){
    for(var i = 0; i< elementos.length; i++){
      elementos[i].removeEventListener("click", capturarClique);
    }
    event.stopPropagation();
    var alvo = event.target;
    var style = getComputedStyle(alvo);
    var color = style.color;
    var bgColor = style.backgroundColor;
    var rgbBgMatch = bgColor.match(/rgb\((\d+), \s*(\d+), s*(\d+)\)/);
    var rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if(rgbMatch && rgbBgMatch){
      var colorRGB = rgbMatch.slice(1).map(value => parseInt(value, 10));
      var bgColorRGB = rgbBgMatch.slice(1).map(value => parseInt(value, 10));

      var corBody = getComputedStyle(document.body).color;
      var bodyRGBMatch = corBody.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

      if (bodyRGBMatch) {
        var bodyRGB = bodyRGBMatch.slice(1).map(value => parseInt(value, 10));
        var isDifferentFromBody = !arraysIguais(colorRGB, bodyRGB);
        if (isDifferentFromBody) {
          getColorName(colorRGB).then(colorName => {
            alert("cor em RGB: " + colorRGB.join(", ") + "\nNome da cor: "+ colorName);
            console.log("cor em RGB: ", colorRGB.join(", "));
            console.log("Nome da cor: ", colorName);
          });
        }
      }
      getColorName(bgColorRGB).then(bgColorName => {
        alert("cor em RGB: " + bgColorRGB.join(", ") + "\nNome da cor: "+ bgColorName);
        console.log("cor RGB: ", bgColorRGB.join(", "));
        console.log("Nome da cor: ", bgColorName);
      });
    }
    else if(rgbMatch){
      var colorRGB = rgbMatch.slice(1).map(value => parseInt(value, 10));
  
      getColorName(colorRGB).then(colorName => {
        alert("cor em RGB: " + colorRGB.join(", ") + "\nNome da cor: "+ colorName);
        console.log("cor em RGB: ", colorRGB.join(", "));
        console.log("Nome da cor: ", colorName);
      });
    } 
    else if(rgbBgMatch){
      var bgColorRGB = rgbBgMatch.slice(1).map(value => parseInt(value, 10));
  
      getColorName(bgColorRGB).then(colorName =>{
        alert("cor em RGB: " + bgColorRGB.join(", ") + "\nNome da cor: "+ colorName);
        console.log("cor em RGB: ", bgColorRGB.join(", "));
        console.log("Nome da cor: ", colorName);
      });
    }
    for(var i = 0; i<links.length; i++){
      links[i].removeEventListener('click', bloquearClique);
    }
  }
  function arraysIguais(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }
    for (var i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
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
  function bloquearClique(){
    event.preventDefault();
  }
}*/



function mudaCorProtanopia(){
  var elementos = document.querySelectorAll("*");

  for(var i = 0; i < elementos.length; i++){
    var estilo = getComputedStyle(elementos[i]);
    var cor = estilo.color;
    var corBG = estilo.getPropertyValue("background-color");
    if (!elementos[i].querySelector("img") && !elementos[i].querySelector("video")){
      if (cor.startsWith("rgb")) {
        var rgb = cor.match(/\d+/g);
        var vermelho = parseInt(rgb[0]);
        var verde = parseInt(rgb[1]);
        var azul = parseInt(rgb[2]);

        if(vermelho > verde && vermelho > azul){
          elementos[i].style.filter = "hue-rotate(15deg) saturate(1.2)";
        }
      }
      if(corBG.startsWith("rgb")){
        var rgbBG = corBG.match(/\d+/g);
        var vermelhoBG = parseInt(rgbBG[0]);
        var verdeBG = parseInt(rgbBG[1]);
        var azulBG = parseInt(rgbBG[2]);

        if(vermelhoBG > verdeBG && vermelhoBG > azulBG){
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

  for(var i = 0; i < elementos.length; i++){
    var estilo = getComputedStyle(elementos[i]);
    var cor = estilo.color;
    var corBG = estilo.getPropertyValue("background-color");
    if(!elementos[i].querySelector("img") && !elementos[i].querySelector("video")){
      if (cor.startsWith("rgb")) {
        var rgb = cor.match(/\d+/g);
        var vermelho = parseInt(rgb[0]);
        var verde = parseInt(rgb[1]);
        var azul = parseInt(rgb[2]);

        if(verde > vermelho && verde > azul){
          elementos[i].style.filter = "hue-rotate(15deg) saturate(1.2)";
        }
      }
      if(corBG.startsWith("rgb")){
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
});