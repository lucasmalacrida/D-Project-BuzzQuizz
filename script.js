// ---------- TELA 1 -------------------------------------------------------------------------------- 

const boxTemp = document.querySelector(".boxTemp");
let keys = Object.keys(localStorage);
let numbers = keys.map(key => parseInt(key));

async function meusQuizzes() {
  boxTemp.innerHTML = '';
  keys = Object.keys(localStorage);
  numbers = keys.map(key => parseInt(key));
  if(localStorage.length === 0){
    return;
  }

  document.querySelector(".seusQuizzes").classList.remove("escondido");
  document.querySelector(".criarQuizzBox").classList.add("escondido");
  document.querySelector(".boxTemp").classList.remove("escondido");

  let promises = [];
  for (let i = 0; i < numbers.length; i++) {
    promises.push(axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${numbers[i]}`));
  }

  try {
    const responses = await Promise.all(promises);
    for (let i = 0; i < responses.length; i++) {
      boxTemp.innerHTML += 
      `<div class="quizz-thumb" id="${numbers[i]}" onclick="toQuizz(this)">
        <p class="quizz-title">${responses[i].data.title}</p>
        <div class="quizz-gradient"></div>
        <img class="quizz-img" alt="Img Quizz" src="${responses[i].data.image}">
      </div>`;
    }
  } catch (error) {
    alert("Erro no servidor! Atualize a página");
  }
}
meusQuizzes();

function quizzesRecebidos() {
  const quizzRecebidos = document.querySelector(".todosQuizzesGrid");
  quizzRecebidos.innerHTML = '';
  axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes`)
  .then((res) => {
    for(let i = 0; i< res.data.length; i++){
      for(let j = 0; i< numbers.length; i++){
        if(res.data[i].id === numbers[j]){
          return;
        }
      }
      quizzRecebidos.innerHTML += 
      `<div class="quizz-thumb" id="${res.data[i].id}" onclick="toQuizz(this)">
        <p class="quizz-title">${res.data[i].title}</p>
        <div class="quizz-gradient"></div>
        <img class="quizz-img" alt="Img Quizz" src="${res.data[i].image}">
      </div>`;
    }
  })
  .catch((erro) => {
      alert("Erro ao Carregar Quizzes! Atualize a página.");
  });
}
quizzesRecebidos();

let quizzSelected;
function toQuizz(selected){
  axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${Number(selected.id)}`)
  .then(response => {loadQuizzSelected(response); quizzSelected = response;})
  .catch(x => alert("Erro ao Selecionar Quizz. Tente novamente."));
}

function toPage2(){
  document.querySelector(".page-1").classList.add("escondido");
  document.querySelector(".page-3-4").classList.add("escondido");
  document.querySelector(".container-header").scrollIntoView();
  document.querySelector(".page-2").classList.remove("escondido");
}

function toPage3(){
  document.querySelector(".page-1").classList.add("escondido");
  document.querySelector(".container-header").scrollIntoView();
  document.querySelector(".page-3-1").classList.remove("escondido");
}

// ---------- FIM TELA 1 --------------------------------------------------------------------------------

// ---------- TELA 2 --------------------------------------------------------------------------------

let indexPergunta=0;
let qntPerguntas;
let tituloQuizz;
let arrayRespostasSorteado=[];
let arrayRespostas=[];
let acertos=0;
let clicks=0;

function loadQuizzSelected(resposta){
  qntPerguntas=resposta.data.questions.length;
  console.log(resposta);
  tituloQuizz=resposta.data.title;
  document.querySelector(".titulo h1").innerHTML=tituloQuizz;
  document.querySelector(".titulo").style.backgroundImage = `url(${resposta.data.image})`;
  document.querySelector(".conteudo-quizz").innerHTML="";

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
  toPage2();
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
    desabilitarRespostas[i].style.opacity = "0.3";
  }

  let nodeList=x.parentElement.querySelectorAll(".respostaErrada");
  
  for(let i=0;i<nodeList.length;i++){
    nodeList[i].querySelector("h3").style.color="#ff4b4b";
  }

  x.style.opacity="1";

  //indo para prox pergunta dps de 2s
  setTimeout(function(){
  document.querySelector(`.auxiliar${indexPergunta}`).scrollIntoView({behavior:'smooth'});
  indexPergunta++;
  },2000);
    
  x.parentElement.querySelector(".respostaCorreta h3").style.color="#009c22";

  criarAbaFinalQuizz();
  condicaoFinalQuizz();
}

let resultado;

function criarAbaFinalQuizz(){
  if(clicks==qntPerguntas){
    resultado=acertos/qntPerguntas*100;
    
    document.querySelector(".conteudo-quizz").innerHTML+=
      `<div class="final-quizz escondido">
        <div class="dados">
          <h2>X% de acerto: Nice!</h2>
        </div>
        <div class="caixa">
          <img src="./media/auxiliar.jpg" alt="" class="img-final-quizz">
          <div class="txt">
            <h4>Mensagem final</h4>
          </div>
        </div>
      </div>
      <button onclick=reiniciarQuizz() class="final-button primary">Reiniciar Quizz</button>
      <button onclick=toHome() class="final-button secondary">Voltar pra home</button>`;
    document.querySelector(".final-quizz h2").innerHTML=`${Math.round(resultado)}% de acerto: `;

    setTimeout(function(){
    document.querySelector(`.final-quizz`).scrollIntoView({behavior:'smooth'});
    indexPergunta++;
    },2000);
  }   
}

function condicaoFinalQuizz(){
  if(clicks==qntPerguntas){
    document.querySelector(`.final-quizz`).classList.remove("escondido"); 
    for(let j=quizzSelected.data.levels.length-1;j>=0;j--){
      if(resultado>=quizzSelected.data.levels[j].minValue){
        console.log(quizzSelected.data.levels[j].image);
        document.querySelector(".img-final-quizz").src=quizzSelected.data.levels[j].image;
        document.querySelector("h4").innerHTML=quizzSelected.data.levels[j].text;
        document.querySelector(".final-quizz h2").innerHTML+=quizzSelected.data.levels[j].title;
        break;
      } 
    }
  }
}

function reiniciarQuizz(){
  clicks=0;
  indexPergunta=0;
  acertos=0;
  document.querySelector(".page-2").classList.add("escondido");
  loadQuizzSelected(quizzSelected);
}

function toHome(){
  clicks=0;
  indexPergunta=0;
  acertos=0;
  document.querySelector(".page-2").classList.add("escondido");
  document.querySelector(".page-3-4").classList.add("escondido");
  document.querySelector(".container-header").scrollIntoView();
  document.querySelector(".page-1").classList.remove("escondido");
}

// ---------- FIM TELA 2 --------------------------------------------------------------------------------

// ---------- TELA 3 - Interatividade Básica --------------------------------------------------------------------------------
function toQuestions(){
  document.querySelector(".page-3-1").classList.add("escondido");
  document.querySelector(".container-header").scrollIntoView();
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
  button.parentNode.firstElementChild.scrollIntoView({behavior:'smooth', block:'center'});
}

function toLevels(){
  document.querySelector(".page-3-2").classList.add("escondido");
  document.querySelector(".container-header").scrollIntoView();
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
  button.parentNode.firstElementChild.scrollIntoView({behavior:'smooth', block:'center'});
}

function toFinal(){
  document.querySelector(".page-3-3").classList.add("escondido");
  document.querySelector(".container-header").scrollIntoView();
  document.querySelector(".page-3-4").classList.remove("escondido");
}

// ---------- TELA 3.1 --------------------------------------------------------------------------------

const inputQuizzTitle = document.querySelector('.input-quizz-title');
const inputQuizzImgUrl = document.querySelector('.input-quizz-imgurl');
const inputQuizzNQuestions = document.querySelector('.input-quizz-n-questions');
let numQuestions =  Number(inputQuizzNQuestions.value);
const inputQuizzNLevels = document.querySelector('.input-quizz-n-levels');
let numLevels = Number(inputQuizzNLevels.value);

let quizzInfo = {title: "", image: "", questions: [], levels: []};

const isURL = (str) => { try { let url = new URL(str); return true; } catch { return false ;} };

function loadQuizzInfo(){
  quizzInfo = {title: "", image: "", questions: [], levels: []};
  quizzInfo.title = inputQuizzTitle.value;
  quizzInfo.image = inputQuizzImgUrl.value;
  numQuestions = Number(inputQuizzNQuestions.value);
  numLevels = Number(inputQuizzNLevels.value);

  let conditionsArray = [];
  if (20<=quizzInfo.title.length && quizzInfo.title.length<=65){ conditionsArray.push(true) } else { conditionsArray.push(false) }
  if (isURL(quizzInfo.image)){ conditionsArray.push(true) } else { conditionsArray.push(false) }
  if (3<=numQuestions){ conditionsArray.push(true) } else { conditionsArray.push(false) }
  if (2<=numLevels){ conditionsArray.push(true) } else { conditionsArray.push(false) }

  if (!conditionsArray.includes(false)){
    loadQuestions();
    loadLevels();
    loadFinal();
    toQuestions();
  } else {
    alert("Erro de validação! Preencha os dados cumprindo os requisitos.");
  }
}

function loadQuestions(){
  const questionsTag = document.querySelector('.questions');
  questionsTag.innerHTML = '';
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
  levelsTag.innerHTML = '';
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

function loadFinal(){
  let page3_4Tag = document.querySelector(".page-3-4 .quizz-thumb");
  page3_4Tag.firstElementChild.innerHTML = quizzInfo.title;
  page3_4Tag.lastElementChild.setAttribute("src",quizzInfo.image);
}

// ---------- TELA 3.2 --------------------------------------------------------------------------------

function isHex(string){
  let hex = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
  six_digit = string.slice(1,7);
  if (string.length === 7 && string[0] === '#' && six_digit.split('').filter(x => hex.includes(x.toUpperCase())).join('') === six_digit){
      return true;
  } else {
      return false;
  }
}

function loadQuizzQuestions(){
  quizzInfo.questions = [];
  let conditionsArray = [];
  for (let i=1; i<=numQuestions; i++){
    let question_i = {
      title : document.querySelector(`.input-${i}-question-text`).value, 
      color : document.querySelector(`.input-${i}-question-bg`).value, 
      answers : [
        {
          text : document.querySelector(`.input-${i}-correct-answer`).value,
          image : document.querySelector(`.input-${i}-correct-imgurl`).value,
          isCorrectAnswer: true
        }
      ]
    };

    if (20 <= question_i.title.length){ conditionsArray.push(true) } else { conditionsArray.push(false) }
    if (isHex(question_i.color)){ conditionsArray.push(true) } else { conditionsArray.push(false) }
    if (question_i.answers[0].text !== ''){ conditionsArray.push(true) } else { conditionsArray.push(false) }
    if (isURL(question_i.answers[0].image)){ conditionsArray.push(true) } else { conditionsArray.push(false) }

    for (let j=1; j<=3;j++){
      let incorrectAnswer_j = document.querySelector(`.input-${i}-incorrect-answer-${j}`).value;
      let incorrectImgUrl_j = document.querySelector(`.input-${i}-incorrect-imgurl-${j}`).value;
      if (incorrectAnswer_j!=='' && incorrectImgUrl_j!==''){
        let answer_j = {
          text : incorrectAnswer_j,
          image : incorrectImgUrl_j,
          isCorrectAnswer: false
        };
        question_i.answers.push(answer_j);

        if (answer_j.text !== ''){ conditionsArray.push(true) } else { conditionsArray.push(false) }
        if (isURL(answer_j.image)){ conditionsArray.push(true) } else { conditionsArray.push(false) }
      }
    }
    quizzInfo.questions.push(question_i);
    
    if (2<=question_i.answers.length){ conditionsArray.push(true) } else { conditionsArray.push(false) }
  }

  if (!conditionsArray.includes(false)){
    toLevels();
  } else {
    alert("Erro de validação! Preencha os dados cumprindo os requisitos.");
  }
}

// ---------- TELA 3.3 --------------------------------------------------------------------------------

function loadQuizzLevels(){
  quizzInfo.levels = [];
  let conditionsArray = [];
  let minValueArray = [];
  for (let i=1; i<=numLevels; i++){
    let level_i = {
      title: document.querySelector(`.input-${i}-level-title`).value, 
      image: document.querySelector(`.input-${i}-level-imgurl`).value, 
      text: document.querySelector(`.input-${i}-level-text`).value,
      minValue: Math.round(Number(document.querySelector(`.input-${i}-level-percent`).value))
    };
    quizzInfo.levels.push(level_i);

    if (10<=level_i.title.length){ conditionsArray.push(true) } else { conditionsArray.push(false) }
    if (isURL(level_i.image)){ conditionsArray.push(true) } else { conditionsArray.push(false) }
    if (30<=level_i.text.length){ conditionsArray.push(true) } else { conditionsArray.push(false) }
    if ((0<=level_i.minValue && level_i.minValue<=100) && (document.querySelector(`.input-${i}-level-percent`).value !== '')){ conditionsArray.push(true) } else { conditionsArray.push(false) }
    minValueArray.push(level_i.minValue);
  }

  if ( !conditionsArray.includes(false) && minValueArray.includes(0)){
    saveQuizz();
  } else {
    alert("Erro de validação! Preencha os dados cumprindo os requisitos.");
  }
}

// ---------- TELA 3.4 --------------------------------------------------------------------------------
let CreatedQuizz;
function saveQuizz(){
  axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes',quizzInfo).then(saveQuizzSucess).catch(x => alert("Erro ao salvar Quizz."));

  function saveQuizzSucess(Response){
    CreatedQuizz = Response.data;
    localStorage.setItem(CreatedQuizz.id , JSON.stringify(quizzInfo));
    meusQuizzes();
    quizzesRecebidos();
    document.querySelectorAll('input').forEach( x => x.value = '');
    toFinal();
  }
}

// ---------- FIM TELA 3 --------------------------------------------------------------------------------