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
let quizzInfo = {title: "", image: "", questions: [], levels: []};

function loadQuizzInfo(){
  quizzInfo.title = inputQuizzTitle.value;
  quizzInfo.image = inputQuizzImgUrl.value;

  let page3_4Tag = document.querySelector(".page-3-4 .quizz-thumb");
  page3_4Tag.firstElementChild.innerHTML = quizzInfo.title;
  page3_4Tag.lastElementChild.setAttribute("src",quizzInfo.image);
}

function loadQuestions(){
  const questionsTag = document.querySelector('.questions');
  let numQuestions = Number(inputQuizzNQuestions.value);
  
  for (let i=1; i<=numQuestions; i++){
    questionsTag.innerHTML += 
      `<div class="forms question closed">
        <h3>Pergunta ${i}</h3>
        <div class="inputs inputs-${i} escondido">
          <input type="text" name="input-${i}-question-text" class="input-${i}-question-text" placeholder="Texto da pergunta">
          <input type="text" name="input-${i}-question-bg" class="input-${i}-question-bg" placeholder="Cor de fundo da pergunta">
  
          <h3>Resposta correta</h3>
          <input type="text" name="input-${i}-correct-answer" class="input-${i}-correct-answer" placeholder="Resposta correta">
          <input type="text" name="input-${i}-correct-imgurl" class="input-${i}-correct-imgurl" placeholder="URL da imagem">
  
          <h3>Respostas incorretas</h3>
          <input type="text" name="input-${i}-incorrect-answer-1" class="input-${i}-incorrect-answer-1" placeholder="Resposta incorreta 1">
          <input type="text" name="input-${i}-incorrect-imgurl-1" class="input-${i}-incorrect-imgurl-1" placeholder="URL da imagem 1">
          <div class="separator"></div>
          <input type="text" name="input-${i}-incorrect-answer-2" class="input-${i}-incorrect-answer-2" placeholder="Resposta incorreta 2">
          <input type="text" name="input-${i}-incorrect-imgurl-2" class="input-${i}-incorrect-imgurl-2" placeholder="URL da imagem 2">
          <div class="separator"></div>
          <input type="text" name="input-${i}-incorrect-answer-3" class="input-${i}-incorrect-answer-3" placeholder="Resposta incorreta 3">
          <input type="text" name="input-${i}-incorrect-imgurl-3" class="input-${i}-incorrect-imgurl-3" placeholder="URL da imagem 3">
        </div>
        <button onclick="editQuestion(this)"><ion-icon name="create-outline"></ion-icon></button>
      </div>`;
  }
  let quest1 = document.querySelector(".questions").firstElementChild;
  let icon1 = quest1.lastElementChild;
  let inputs1 = icon1.previousElementSibling;

  quest1.classList.add("open");
  quest1.classList.remove("closed");
  icon1.classList.add("escondido");
  inputs1.classList.remove("escondido");
}

function loadLevels(){
  const levelsTag = document.querySelector('.levels');
  let numLevels = Number(inputQuizzNLevels.value);
  
  for (let i=1; i<=numLevels; i++){
    levelsTag.innerHTML += 
      `<div class="forms level closed">
        <h3>Nível ${i}</h3>
        <div class="inputs inputs-${i} escondido">
          <input type="text" name="input-${i}-level-title" class="input-${i}-level-title" placeholder="Título do nível">
          <input type="text" name="input-${i}-level-percent" class="input-${i}-level-percent" placeholder="% de acerto mínima">
          <input type="text" name="input-${i}-level-imgurl" class="input-${i}-level-imgurl" placeholder="URL da imagem do nível">
          <input type="text" name="input-${i}-level-text" class="input-${i}-level-text" placeholder="Descrição do nível">
        </div>
        <button onclick="editLevel(this)"><ion-icon name="create-outline"></ion-icon></button>
      </div>`;
  }
  let level1 = document.querySelector(".levels").firstElementChild;
  let icon1 = level1.lastElementChild;
  let inputs1 = icon1.previousElementSibling;

  level1.classList.add("open");
  level1.classList.remove("closed");
  icon1.classList.add("escondido");
  inputs1.classList.remove("escondido");
}

// ---------- TELA 3.2 --------------------------------------------------------------------------------

function loadQuizzQuestions(){
  let numQuestions = Number(inputQuizzNQuestions.value);
  for (let i=1; i<=numQuestions; i++){
    let question_i = {
      title: document.querySelector(`.input-${i}-question-text`).value, 
      color: document.querySelector(`.input-${i}-question-bg`).value, 
      answers: [
        {
          text : document.querySelector(`.input-${i}-correct-answer`).value,
          image : document.querySelector(`.input-${i}-correct-imgurl`).value,
          isCorrectAnswer: true
        }
      ]
    };

    for (let j=1; j<=3;j++){
      let answer_j = {
        text : document.querySelector(`.input-${i}-incorrect-answer-${j}`).value,
        image : document.querySelector(`.input-${i}-incorrect-imgurl-${j}`).value,
        isCorrectAnswer: false
      };
      question_i.answers.push(answer_j);
    }

    quizzInfo.questions.push(question_i);
  }
}

// ---------- TELA 3.3 --------------------------------------------------------------------------------

function loadQuizzLevels(){
  let numLevels = Number(inputQuizzNLevels.value);
  for (let i=1; i<=numLevels; i++){
    let level_i = {
      title: document.querySelector(`.input-${i}-level-title`).value, 
      image: document.querySelector(`.input-${i}-level-imgurl`).value, 
      text: document.querySelector(`.input-${i}-level-text`).value,
      minValue: Math.round(Number(document.querySelector(`.input-${i}-level-percent`).value))
    };
    quizzInfo.levels.push(level_i);
  }
}

// ---------- TELA 3.4 --------------------------------------------------------------------------------


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




// ---------- FIM TELA 3 --------------------------------------------------------------------------------