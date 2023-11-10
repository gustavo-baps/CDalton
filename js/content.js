var cliqueListener = false;
var capturaAtiva = false;
var ativadoP = false;
var ativadoD = false;
var ativadoT = false;
function capturarCliqueNaPagina(){
  capturaAtiva = true;
  const scrollY = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;
  disableScroll();
  console.log(capturaAtiva)
  chrome.runtime.sendMessage({ message: "capturaClique" }, function (response){
    const imageDataUrl = response.imageDataUrl;

    const img = new Image();
    img.src = imageDataUrl;

    img.onload = function (){
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d");
      if(canvas.height < pageHeight){
        canvas.height = pageHeight; 
      }
      
      const offsetY = -scrollY;
      console.log(offsetY)
      canvas.style.marginTop = -offsetY + 'px';
      context.drawImage(img, 0, -offsetY, img.width, img.height);

      if(!document._clickListenerAdded){
        document._clickListenerAdded = true;

        cliqueListener = function (event){
          const x = event.clientX;
          const y = event.clientY + window.scrollY;

          const pixelData = context.getImageData(x, y, 1, 1).data;
          const stringCor = `${pixelData[0]},${pixelData[1]},${pixelData[2]}`;
          var red = pixelData[0];
          var green = pixelData[1];
          var blue = pixelData[2];
          corNomeLegal = retornaCor(red, green, blue);
          console.log(corNomeLegal)
          getColorName(stringCor).then(colorName =>{
            const info = document.createElement("div");
            info.innerHTML = "Cor em RGB: " + stringCor + "<br>Nome da cor: " + colorName + "<br>Semelhante a "+corNomeLegal;
            info.style.position = "absolute";
            info.style.left = x + "px";
            info.style.top = y + "px";
            info.style.backgroundColor = "white";
            info.style.border = "1px solid black";
            info.style.padding = "10px";
            info.style.fontFamily = 'Verdana';
            info.style.fontSize = '12px';
            info.style.zIndex = 1000000000000;

            document.body.appendChild(info);
            console.log("cor em RGB: ", stringCor);
            console.log("Nome da cor: ", colorName);
            setTimeout(function(){
              if(info){
                info.parentNode.removeChild(info);
                info = null;
              }
            }, 3000);
          });
        };
        document.addEventListener("click", cliqueListener);
        console.log("evento adicionado");
      }
      document.body.style.overflow = "auto"; 
    };
    if(capturaAtiva){
      const links = document.querySelectorAll("div");
      links.forEach(function (link){
        link.addEventListener("click", bloquearRedirect);
      });
    }
  });
  async function getColorName(rgb) {
    var apiUrl = `https://www.thecolorapi.com/id?rgb=${rgb}`;
    try{
      var resp = await fetch(apiUrl);
      var data = await resp.json();
      if (resp.ok) {
        return data.name.value || "Unknown";
      } else {
        console.error('erro na resposta da api: ', data);
        return "Unknown";
      }
    }catch(error){
      console.error('erro: ', error);
      return 'unknown';
    }
  }
  function retornaCor(red, green, blue){
    if(red >=238 && red<=255 && green>=204 && green<=255 && blue>=0 && blue<=80){
      return "amarelo"
    }
    if(red >=0 && red<=173 && green>=1 && green<=216 && blue>=54 && blue<=255){
      return "azul"
    }
    if(red >=0 && red<=210 && green>=50 && green<=255 && blue>=0 && blue<=219){
      return "verde"
    }
    if(red >=170 && red<=255 && green>=0 && green<=116 && blue>=0 && blue<=60){
      return "vermelho"
    }
    if(red >=210 && red<=255 && green>=65 && green<=165 && blue>=0 && blue<=60){
      return "laranja"
    }
    if(red >=60 && red<=255 && green>=20 && green<=228 && blue>=0 && blue<=196){
      return "marrom"
    }
    if(red >=75 && red<=230 && green==0 && blue>=71 && blue<=255){
      return "roxo"
    }
    if(red >=102 && red<=255 && green>=0 && green<=228 && blue>=55 && blue<=255){
      return "rosa"
    }
    if(red == green && red == blue && red >=20 && red <=240){
      return "cinza"
    }
    if(red == green && red == blue && red >=0 && red <=20){
      return "preto"
    }
    if(red == green && red == blue && red >=240 && red <=255){
      return "branco"
    }
  }
  
}
function disableScroll() {
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}
function enableScroll() {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

function bloquearRedirect(event){
  event.preventDefault();
}


document.addEventListener("DOMContentLoaded", function (){
  var corBotaoP = document.getElementById("botaoProtanopia");
  var corBotaoD = document.getElementById("botaoDeuteranopia");
  var corBotaoT = document.getElementById("botaoTritanopia");

  function atualizarEstadoBotoes() {
    localStorage.setItem("ativadoP", ativadoP);
    localStorage.setItem("ativadoD", ativadoD);
    localStorage.setItem("ativadoT", ativadoT);
  }

  corBotaoP.addEventListener("click", function (){
    ativadoP = !ativadoP;
    corBotaoD.setAttribute('style', "background-color: #D9D9D9");
    corBotaoP.setAttribute('style', 'background-color: #656565');
    corBotaoT.setAttribute('style', "background-color: #D9D9D9");
    if(ativadoP){
      ativadoD = false;
      ativadoT = false; 
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
    atualizarEstadoBotoes();
  });
  var ativadoD = false;
  corBotaoD.addEventListener("click", function (){
    ativadoD = !ativadoD;
    corBotaoP.setAttribute('style', "background-color: #D9D9D9");
    corBotaoD.setAttribute('style', 'background-color: #656565');
    corBotaoT.setAttribute('style', "background-color: #D9D9D9")
    if(ativadoD){
      ativadoP = false;
      ativadoT = false;
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
    atualizarEstadoBotoes();
  });
  corBotaoT.addEventListener("click", function (){
    ativadoT = !ativadoT;
    corBotaoD.setAttribute('style', "background-color: #D9D9D9");
    corBotaoP.setAttribute('style', 'background-color: #D9D9D9');
    corBotaoT.setAttribute('style', 'background-color: #656565');
    if(ativadoT){
      ativadoD = false;
      ativadoP = false;
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
      chrome.tabs.query({}, function(tabs){
        tabs.forEach(function(tab) {
          chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: desativaT,
          });
        });
      });
    }
    atualizarEstadoBotoes();
  });
  function carregarEstadoBotoes() {
    ativadoP = localStorage.getItem("ativadoP") === "true";
    ativadoD = localStorage.getItem("ativadoD") === "true";
    ativadoT = localStorage.getItem("ativadoT") === "true";

    if(ativadoD){
      corBotaoD.setAttribute('style', "background-color: #656565");
    }
    if(ativadoP){
      corBotaoP.setAttribute('style', "background-color: #656565");
    }
    if(ativadoT){
      corBotaoT.setAttribute('style', "background-color: #656565");
    }
  }
  carregarEstadoBotoes();

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
  function desativaT(){
    console.log("desativada");  
    document.removeEventListener("click", cliqueListener);
    document._clickListenerAdded = false;
    var links = document.querySelectorAll("div");
    links.forEach(function (link){
      link.removeEventListener("click", bloquearRedirect);
    });
    enableScroll();
  }
});
