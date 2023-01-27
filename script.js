//---------------------------------TELA 2


const promise=axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/1');

tela2();
function tela2(){

promise.then(PegarUmQuizz);

}

let indexPergunta=0;
let qntPerguntas;
let tituloQuizz;
let arrayRespostasSorteado=[];
let arrayRespostas=[];
let acertos=0;
let clicks=0;

function PegarUmQuizz(resposta){
    qntPerguntas=resposta.data.questions.length;
    console.log(resposta);
    tituloQuizz=resposta.data.title;
    document.querySelector(".titulo h1").innerHTML=tituloQuizz;
    document.querySelector(".titulo").style.backgroundImage = `url(${resposta.data.image})`;
    //document.querySelector(".titulo").style.backgroundColor= "rgba(0, 0, 0, 0.6)";  FILTRO PRETO NA IMAGEM
    for(let i=0;i<resposta.data.questions.length;i++){
    
    arrayRespostas=[];
                    
    document.querySelector(".conteudo-quizz").innerHTML+=`
    <div class="quizz ">
    </div>` ;

    document.querySelector('.conteudo-quizz').children[i].innerHTML+=`
                <div class="pergunta">
                <h2>${resposta.data.questions[i].title}</h2>
                </div>
                <div class="respostas">
                </div>
                <div class="auxiliar${i}"></div>
            `;
    document.querySelector('.conteudo-quizz').children[i].querySelector(".pergunta").style.backgroundColor = `${resposta.data.questions[i].color}`;
        
            for(let j=0;j<resposta.data.questions[i].answers.length;j++){
              if(resposta.data.questions[i].answers[j].isCorrectAnswer==true){
              let cadaResposta= `
              <div class="resposta respostaCorreta" onclick=selecionarResposta(this)>
                  <img src="${resposta.data.questions[i].answers[j].image}" class="img-resposta" alt="">
                  <h3>${resposta.data.questions[i].answers[j].text}</h3>
              </div>
              `;
              
              arrayRespostas.push(cadaResposta);
              }else{
                let cadaResposta= `
              <div class="resposta respostaErrada" onclick=selecionarResposta(this)>
                  <img src="${resposta.data.questions[i].answers[j].image}" class="img-resposta" alt="">
                  <h3>${resposta.data.questions[i].answers[j].text}</h3>
              </div>
              `;
              arrayRespostas.push(cadaResposta);
              }
            }

            arrayRespostasSorteado=arrayRespostas.sort(comparador);

            for(let k=0;k<resposta.data.questions[i].answers.length;k++){
              document.querySelector('.conteudo-quizz').children[i].querySelector(".respostas").innerHTML+=arrayRespostasSorteado[k];
                         
              
              
            }
           
            
            
      }
    
      
 }
       
function comparador(){
  return Math.random() -0.5;
}
          
function selecionarResposta(x){

  if(x.classList.contains("respostaCorreta")){
    
    clicks++;
    acertos++;
  }else{
    
    clicks++;
  }
  
  //desabilitar respostas da pergunta após o click
  let desabilitarRespostas=x.parentElement.querySelectorAll(".resposta");
  console.log(desabilitarRespostas);
  for(let i=0;i<desabilitarRespostas.length;i++){
    desabilitarRespostas[i].removeAttribute("onclick");
  }

  let nodeList=x.parentElement.querySelectorAll(".respostaErrada");
  
  for(let i=0;i<nodeList.length;i++){
    nodeList[i].style.opacity = "0.3";
    nodeList[i].style.color="#ff4b4b";
  }

  //indo para prox pergunta dps de 2s
  setTimeout(function(){
  document.querySelector(`.auxiliar${indexPergunta}`).scrollIntoView(true);
  indexPergunta++;
  },2000);
    
  x.parentElement.querySelector(".respostaCorreta h3").style.color="#009c22";

  criarAbaFinalQuizz();
  promise.then(condicaoFinalQuizz);
}

let resultado;

function criarAbaFinalQuizz(response){
    if(clicks==qntPerguntas){
        resultado=acertos/qntPerguntas*100;
        
        document.querySelector(".conteudo-quizz").innerHTML+=`
        <div class="final-quizz">
              <div class="dados">
                <h2>X% de acerto: Nice!</h2>
              </div>
              <div class="caixa">
                <img src="./media/auxiliar.jpg" alt="" class="img-final-quizz">
                <div class="txt">
                  <h4>Mensagem final</h4>
                </div>
              </div>
              <div class="botoes">
                <div class="bot1">
                  <p class="txt-bot1">Reiniciar Quizz</p>
                </div>
                <div class="bot2">
                  <p class="txt-bot2">Voltar pra home</p>
                </div>
              </div>
            </div> ` ;  
      document.querySelector(".final-quizz h2").innerHTML=`${Math.ceil(resultado)}% de acerto: `;

      setTimeout(function(){
      document.querySelector(`.final-quizz`).scrollIntoView(true);
      indexPergunta++;
      },2000);

  }
      
}

function condicaoFinalQuizz(response){
  
  if(clicks==qntPerguntas){  
     for(let j=response.data.levels.length-1;j>0;j--){
         if(resultado>=response.data.levels[j].minValue){
           console.log(response.data.levels[j].image);
           document.querySelector(".img-final-quizz").src=response.data.levels[j].image;
           document.querySelector("h4").innerHTML=response.data.levels[j].text;
           document.querySelector(".final-quizz h2").innerHTML+=response.data.levels[j].title;
           break;
         } 
     } 
    
  }
}
//-------------------------------------------------FIM TELA 2
