// ---------- TELA 1 -------------------------------------------------------------------------------- 
function randomNumber() {
  return Math.floor(Math.random() * 49);
}

const quizzRecebidos = document.querySelector(".todosQuizzesGrid");

function quizzesRecebidos() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes")
  promise.then((res) => {
    console.log(res)
    for(let i = 0; i<6;i++){
      let randomNum = randomNumber();
    quizzRecebidos.innerHTML += `
    <figure id="model-quiz">
    <img src="${res.data[randomNum].image}"/>  
    <figcaption>${res.data[randomNum].title}</figcaption>
  </figure>
    `
}})
promise.catch((erro) => {
    alert("Erro no servidor! Atualize a página")
})
}
quizzesRecebidos();

// ---------- FIM TELA 1 --------------------------------------------------------------------------------

// ---------- TELA 2 --------------------------------------------------------------------------------

const promise=axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/1');

tela2();
function tela2(){ promise.then(PegarUmQuizz); }

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
                    
    document.querySelector(".conteudo-quizz").innerHTML+=
      `<div class="quizz "></div>`;

    document.querySelector('.conteudo-quizz').children[i].innerHTML+=
      `<div class="pergunta">
        <h2>${resposta.data.questions[i].title}</h2>
      </div>
      <div class="respostas"></div>
      <div class="auxiliar${i}"></div>`;

    document.querySelector('.conteudo-quizz').children[i].querySelector(".pergunta").style.backgroundColor = `${resposta.data.questions[i].color}`;
        
    for(let j=0;j<resposta.data.questions[i].answers.length;j++){
      if(resposta.data.questions[i].answers[j].isCorrectAnswer==true){
        let cadaResposta= 
        `<div class="resposta respostaCorreta" onclick=selecionarResposta(this)>
            <img src="${resposta.data.questions[i].answers[j].image}" class="img-resposta" alt="">
            <h3>${resposta.data.questions[i].answers[j].text}</h3>
        </div>`;
        arrayRespostas.push(cadaResposta);

      } else {
        let cadaResposta=
        `<div class="resposta respostaErrada" onclick=selecionarResposta(this)>
            <img src="${resposta.data.questions[i].answers[j].image}" class="img-resposta" alt="">
            <h3>${resposta.data.questions[i].answers[j].text}</h3>
        </div>`;
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
    
    document.querySelector(".conteudo-quizz").innerHTML+=
    `<div class="final-quizz">
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
        </div>`;
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
// ---------- FIM TELA 2 --------------------------------------------------------------------------------

// ---------- TELA 3 - Interatividade Básica --------------------------------------------------------------------------------
function toQuestions(){
  document.querySelector(".page-3-1").classList.add("escondido");
  document.querySelector(".page-3-2").classList.remove("escondido");
}

function editQuestion(button){
  let questSelected = document.querySelector(".questions .open");
  let iconSelected = questSelected.lastElementChild;
  let inputsSelected = iconSelected.previousElementSibling;

  questSelected.classList.remove("open");
  questSelected.classList.add("closed");
  iconSelected.classList.remove("escondido");
  inputsSelected.classList.add("escondido");

  let quest = button.parentNode;
  quest.classList.remove("closed");
  quest.classList.add("open");
  button.classList.add("escondido");
  button.previousElementSibling.classList.remove("escondido");
}

function toLevels(){
  document.querySelector(".page-3-2").classList.add("escondido");
  document.querySelector(".page-3-3").classList.remove("escondido");
}

function editLevel(button){
  let levelSelected = document.querySelector(".levels .open");
  let iconSelected = levelSelected.lastElementChild;
  let inputsSelected = iconSelected.previousElementSibling;

  levelSelected.classList.remove("open");
  levelSelected.classList.add("closed");
  iconSelected.classList.remove("escondido");
  inputsSelected.classList.add("escondido");

  let level = button.parentNode;
  level.classList.remove("closed");
  level.classList.add("open");
  button.classList.add("escondido");
  button.previousElementSibling.classList.remove("escondido");
}

function toFinal(){
  document.querySelector(".page-3-3").classList.add("escondido");
  document.querySelector(".page-3-4").classList.remove("escondido");
}

function toQuizz(){
  document.querySelector(".page-3-4").classList.add("escondido");
  document.querySelector(".pagina-quizz").classList.remove("escondido");
  // ...
}

function toHome(){
  document.querySelector(".page-3-4").classList.add("escondido");
  document.querySelector(".containerPage1").classList.remove("escondido");
  // ...
}

// ---------- TELA 3.1 --------------------------------------------------------------------------------

const inputQuizzTitle = document.querySelector('.input-quizz-title');
const inputQuizzImgUrl = document.querySelector('.input-quizz-imgurl');
const inputQuizzNQuestions = document.querySelector('.input-quizz-n-questions');
const inputQuizzNLevels = document.querySelector('.input-quizz-n-levels');
let numQuestions = inputQuizzNQuestions.value;
let numLevels = inputQuizzNLevels.value;

// const questionsTag = document.querySelector('.questions');
// for (let i=0; i<numQuestions;i++){
//   let questionTag = document.querySelector('.forms .question');

// }

// function sendMsg(){
//     let quizzObject = {
//         from: user.name,
//         to: contact,
//         text: msgInput.value,
//         type: (visibility === "Reservadamente")? "private_message" : "message"
//     }

//     axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes',quizzObject).then(sendMsgSucess).catch(sendMsgError);

//     function sendMsgSucess(Response){
//         loadMsgs();
//     }

//     function sendMsgError(Response){
//         alert("Erro de conexão.");
//         window.location.reload()
//     }
// }

// ---------- TELA 3.2 --------------------------------------------------------------------------------

// ---------- TELA 3.3 --------------------------------------------------------------------------------

// ---------- TELA 3.4 --------------------------------------------------------------------------------


// ---------- FIM TELA 3 --------------------------------------------------------------------------------