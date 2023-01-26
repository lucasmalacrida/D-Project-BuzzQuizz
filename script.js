//---------------------------------TELA 2
tela2();

function tela2(){
const promise=axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/1');
promise.then(PegarUmQuizz);
}

let tituloQuizz;


function PegarUmQuizz(resposta){
    console.log(resposta);
    tituloQuizz=resposta.data.title;
    document.querySelector(".titulo h1").innerHTML=tituloQuizz;
    document.querySelector(".titulo").style.backgroundImage = `url(${resposta.data.image})`;
 
    for(let i=0;i<resposta.data.questions.length;i++){
    document.querySelector(".conteudo-quizz").innerHTML+=`
    <div class="quizz ">
    </div>` ;

    document.querySelector('.conteudo-quizz').children[i].innerHTML+=`
                <div class="pergunta">
                <h2>${resposta.data.questions[i].title}</h2>
                </div>
                <div class="respostas">
                </div>
            `;
            document.querySelector('.conteudo-quizz').children[i].querySelector(".pergunta").style.backgroundColor = `${resposta.data.questions[i].color}`;
        for(let j=0;j<resposta.data.questions[i].answers.length;j++){
            document.querySelector('.conteudo-quizz').children[i].querySelector(".respostas").innerHTML+=`
             <div class="resposta" onclick=selecionarResposta(this)>
                <img src="${resposta.data.questions[i].answers[j].image}" class="img-resposta" alt="">
                <h3>${resposta.data.questions[i].answers[j].text}</h3>
             </div>
        `;

        if(resposta.data.questions[i].answers[j].isCorrectAnswer==true){
          document.querySelector('.conteudo-quizz').children[i].querySelector(".respostas").children[j].classList.add("respostaCorreta");
        }else{
          document.querySelector('.conteudo-quizz').children[i].querySelector(".respostas").children[j].classList.add("respostaErrada");
        }


        }
        
     }
      
     document.querySelector(".conteudo-quizz").innerHTML+=`
     <div class="final-quizz">
          <div class="dados">
            <h2>100% de acerto: Nice!</h2>
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
          }
       
        

          
function selecionarResposta(x){
  if(x.classList.contains("respostaCorreta")){
    alert("certo");
  }else{
    alert("f");
  }
 let nodeList=x.parentElement.querySelectorAll(".respostaErrada");

 for(let i=0;i<nodeList.length;i++){
  nodeList[i].style.opacity = "0.3";
  nodeList[i].style.color="#ff4b4b";
}
x.parentElement.querySelector(".respostaCorreta h3").style.color="#009c22";
}
//-------------------------------------------------FIM TELA 2
