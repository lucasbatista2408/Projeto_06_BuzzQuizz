let deslist = [];
let listaQuizz = []; //variavel com array dos quizzes
let myQuizz;
let title;
let image;
let questions; 
let id = 0; 
let correctA=0, questionA=0, pcent = 0;
let levels=[];
let quizzId;
let questionL = 0; 
let Nivelcorreto=0; ///resultado final ao usuário
let createdQuizz ={
	title: "Título do quizz",
	image: "https://http.cat/411.jpg",
	questions: [],
    levels: []
};
let question={
    title: "Título da pergunta 1",
    color: "#123456",
    answers: []
};
let answer={
    text: "Texto da resposta 1",
    image: "https://http.cat/411.jpg",
    isCorrectAnswer: true
};
let emptyAnswer={
    text: " ",
    image: " ",
    isCorrectAnswer: false
};
let level ={
    title: "Título do nível 1",
    image: "https://http.cat/411.jpg",
    text: "Descrição do nível 1",
    minValue: 0
};

/////////////////////  Codigo executado ao iniciar  //////////////////
homePage();
//homepage
function refreshHome(){
    window.location.reload();
}

function homePage(){// cria a homepage com meus quizzes e outros quizzes
    
    document.querySelector(".page").innerHTML=`
    <div class="myQuizzesTitle hidden">
        <p> Seus Quizzes </p>
        <ion-icon onclick="createQuizzPg1()" name="add-circle"></ion-icon>
    </div> 
    <div class="myQuizzes">
        <h4 >Você não criou nenhum <br> quizz ainda :(</h4>
        <p class="criarQuizzText red" onclick="createQuizzPg1()">Criar Quizz</p>
    </div>
    <div class="flexStart">
        <h2> Todos os quizzes</h2>
    </div>
    <div class="other-quizzes"></div>
    </div>`;
    getQuizzes();
}

function addMyQuizzes(){
    outlocalStorage()
    console.log(myQuizz)

    if (myQuizz != null){
        document.querySelector(".myQuizzes").innerHTML = ""
        document.querySelector(".myQuizzes").classList.add("myQuizzesFull")
        document.querySelector(".myQuizzesFull").classList.remove("myQuizzes")
        document.querySelector(".myQuizzesTitle").classList.remove("hidden")
    }
    console.log(listaQuizz)
    for(i = 0; i < listaQuizz.length; i++){
        for(j = 0; j < myQuizz.length; j++){   
            if(myQuizz[j] == listaQuizz[i].id){
            console.log(listaQuizz[i].id)
            document.querySelector(".myQuizzesFull").innerHTML += `
            <button id="${listaQuizz[i].id}" onclick="showQuizz(${i})" class="quizzBox"> 
            <img src="${listaQuizz[i].image}" alt="thumb"> 
            <div class="gradient"></div> 
            <h1 class="QuizzTitle white"> ${listaQuizz[i].title} </h1>
            </button>`
            console.log('ok')
            }
        }
    }
}


function getQuizzes(){ //faz get na lista de quizzes
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes');
    promise.then(printQuizzes);
    promise.then(addMyQuizzes);
}
let showingQuizzIndex;
function printQuizzes(quizzes){ //mostra a lista de quizzes no html homepage
    let otherQuizzes = document.querySelector(".other-quizzes"); // oQuizzes => otherQuizzes
    listaQuizz = quizzes.data;
    console.log(quizzes.data);
    for(i = 0; i < listaQuizz.length; i++){     // ADICIONAR OS QUIZZES DO SERVER
        otherQuizzes.innerHTML += ` 
        <button id="${listaQuizz[i].id}" onclick="showQuizz(${i})" class="quizzBox"> 
        <img src="${listaQuizz[i].image}" alt="thumb"> 
        <div class="gradient"></div> 
        <h1 class="QuizzTitle white"> ${listaQuizz[i].title} </h1>
        </button>`
    }
}

function showQuizz(index){ //mostra o quizz selecionado
    showingQuizzIndex=index;
    document.querySelector(".header").classList.add("marginzero"); //margin 0 no topo
    document.querySelector(".page").innerHTML = `
    <div class="gradient2"></div> 
    <img class="header2" src="${listaQuizz[index].image}" alt="thumb"/> 
    <h1 class="QuizzTitle white "> ${listaQuizz[index].title} </h1>
    `;
    printQuestions(listaQuizz[index]);
}

//Tela 2 responsável por mostrar as perguntas
function printQuestions(dadosdoQuizz){
    //const dadosdoQuizz=quizz.data;
    
    level=dadosdoQuizz.levels;
    id=dadosdoQuizz.id;
    window.scrollTo(0,0);
    questionL = dadosdoQuizz.questions.length; //numero de perguntas
    
    for(let i=0;i<questionL;i++){
        const questionsBox=document.querySelector(".questionsBox");
        questionsBox.innerHTML+=
        `<div class="perguntas" data-id="${listaQuizz[i].index}">
        <div style="background-color: ${dadosdoQuizz.questions[i].color}" class="titleQuestions white">
        <h2 class="white">${dadosdoQuizz.questions[i].title}</h1>
        </div>
        <div class="all"></div> 
        </div>`

        const TotalResponses=document.querySelectorAll(".all");
        let shuffled=dadosdoQuizz.questions[i].answers;
        shuffled.sort(shuffling);

        for(let k=0;k<shuffled.length;k++){
            TotalResponses[i].innerHTML+=`
            <div class="alternative" id="${shuffled[k].isCorrectAnswer}" onclick="AnswerClicked(this)">
                <img class="QuestionFigure" src="${shuffled[k].image}"/>
                <p class="QuestionAltenative">${shuffled[k].text}</p> 
            </div>
            `
        }
    }
}

 // document.querySelector(".all").innerHTML+=`
            // <div class="alternative" id="${shuffled[k].isCorrectAnswer}" onclick="AnswerClicked(this)">
            //     <div><img class="QuestionFigure" src="${shuffled[k].image}"/></div>
            //     <p class="QuestionAlternative">${shuffled[k].text}</p>
            // </div>

//Embaralha as perguntas/respostas
function shuffling(){
    return Math.random()-0.5;
}
    
// Check for correct answer:
function AnswerClicked(answer){
    let valid = answer.id;
    const QuestiosImages=[];
    let father=answer.parentNode;
    const all=father.children;
    console.log(answer.image);

    if(valid == "true"){
    answer.classList.add('green')
        correctA += 1;
    } else{
        answer.classList.add('red')
    }
    questionA ++;


    for(let i=0;i<all.length;i++){
        QuestiosImages.push(all[i].firstElementChild)
        console.log(QuestiosImages)
       // QuestiosImages[i].innerHTML=`<div class="whiteEffect"></div>`
        all[i].removeAttribute("onclick")
    }

    let QuestionsSet=document.querySelector(".questionsBox").childNodes;
    if(father.parentNode.nextElementSibling){
        setTimeout(goDown,2000,father)
    }
    else{
        let TotalRightAnswers=Math.floor((correctA/QuestionsSet.length)*100)
        setTimeout(showAllresults,2000,TotalRightAnswers)
    }
}
//Faz o scroll
function goDown(element){
    element.parentNode.nextElementSibling.scrollIntoView()
}

function showAllresults(porcent){
    let BoxQuestions=document.querySelector(".questionsBox");
    
    // for(let i=0;i<levels.length;i++){
    //     if(porcent>levels[i].minValue && Nivelcorreto<levels.length-1){
    //         Nivelcorreto=Nivelcorreto+1;
    //     }
    // }
    let userLevel;
    for(let i=0;i<listaQuizz[showingQuizzIndex].levels.length;i++){
        if(listaQuizz[showingQuizzIndex].levels[i].minValue<=porcent){
            userlevel=i;
        }
    }

     BoxQuestions.innerHTML+=`<div class="QuizzFinalResult bold perguntas">
        <div class="headerResultTest white"><h2 class="white">Você acertou ${porcent}%, ${listaQuizz[showingQuizzIndex].levels[userlevel].title}</h2></div>
     
        <div class="resultdesc">
            <img src="${listaQuizz[showingQuizzIndex].levels[userlevel].image}"/>
            <div class="finalResult"> 
                <p class="finalResultText"> <strong>${listaQuizz[showingQuizzIndex].levels[userlevel].text}</strong> </p> 
            </div>
        </div>

        <div class="buttons">
            <button class="reiniciar white" onclick="reloadPage2()">Jogar de novo</button>
            <button class="GoHomePage" onclick="refreshHome()">Ir para Home</button>
        </div>

        </div>`

        let Final=document.querySelector(".QuizzFinalResult");
        Final.scrollIntoView();
        levels=[]
        Nivelcorreto=0;
}

 //recarrega a pagina 2 quando clicado no botão
function reloadPage2(){
    let questionBox=document.querySelector(".questionsBox");
    questionBox.innerHTML="";
    quizzId=axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    quizzId.then(replayQuizz);
}
function replayQuizz(quizz){ //trata o resultado do then e envia somente os dados para o printQuestions
    printQuestions(quizz.data);
}

//////////////////Aqui começa o createQuizz ///////////////// 

function createQuizzPg1(){ //Primeira tela para criar quizz
    // ADICIONEI CLASS PRA H2, PRA PODER DAR MARGIN AUTO NELA E NA WHITEBOX, PRA PODER CENTRALIZAR AS DUAS NA PAGE. ISSO PQ TIREI O MARGIN DA CLASS 'PAGE' NO CSS, SÓ ASSIM CONSEGUI RESOLVER O 'TODOS OS QUIZZES' QUE ESTAVA CENTRALIZADO. AGORA O H2 CLASS 'PAGETITLE' E O WHITEBOX TEM MARGIN AUTO.
    document.querySelector(".page").innerHTML=`
    <h2 class="pageTitle">Comece pelo começo</h2> 
    <div class="whiteBox">
        <input id="a1" placeholder="Título do seu quizz" type="text" minlength="20" maxlength="65" required>
        <input id="a2" placeholder="URL da imagem do seu quizz" type="url" required>
        <input id="a3" placeholder="Quantidade de perguntas do quizz" type="number" min="3" required>
        <input id="a4" placeholder="Quantidade de níveis do quizz" type="number" min="2" required>
        <button class="redBox" onclick="readQuizzPg1()">Prosseguir pra criar perguntas</button> 
    </div>`
    ;
}
function readQuizzPg1() {
    title=document.getElementById("a1").value;
    image=document.getElementById("a2").value;
    questions=document.getElementById("a3").value;
    levels=document.getElementById("a4").value;
    if(title.length<20 || title.length>65){
        alert(`Escolha um título com entre 20 e 65 caractéres, o seu está com ${title.length}`);
        return;
    }
    if(!isValidHttpUrl(image)){
        alert('Insira uma url de imagem válida');
        return;
    }
    if(questions<3){
        alert('Mínimo de 3 perguntas');
        return;
    }
    if(levels<2){
        alert('Mínimo de 2 níveis');
        return;
    }
    console.log("title: "+title);
    createdQuizz.title=title;

    console.log("createdquizz.title: "+createdQuizz.title);
    createdQuizz.image=image;
    createQuizzPg2();
}
function isValidHttpUrl(string) { //verifica se a string é url
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return true;
}
function isValidColor(string){
    if(string[0]=="#"){
        if(string.length==7){
            return true;
        }
    }
    return false;
}
function createQuizzPg2(){
    document.querySelector(".page").innerHTML=`
    <div class="center">
        <h2>Crie suas perguntas</h2>
    </div>
    `;
    for(let i =0;i<questions;i++){
        if(i==0){
            document.querySelector(".page").innerHTML+=`
            <div class="whiteBox">
                <h2>Pergunta ${i+1} </h2>
                <input id="a${i+1}1" type="text" placeholder="Texto da pergunta" minlength="20">
                <input id="a${i+1}2" type="text" placeholder="Cor de fundo da pergunta">
                <h2>Resposta correta</h2>
                <input id="a${i+1}3" type="text" placeholder="Resposta correta">
                <input id="a${i+1}4" type="url" placeholder="URL de imagem">
                <h2>Respostas incorretas</h2>
                <input id="a${i+1}5" type="text" placeholder="Resposta incorreta 1">
                <input id="a${i+1}6" type="url" placeholder="URL de imagem 1">
                <input id="a${i+1}7" type="text" placeholder="Resposta incorreta 2">
                <input id="a${i+1}8" type="url" placeholder="URL de imagem 2">
                <input id="a${i+1}9" type="text" placeholder="Resposta incorreta 3">
                <input id="a${i+1}10" type="url" placeholder="URL de imagem 3">
            </div>
            `;
        }else{
            document.querySelector(".page").innerHTML+=`
            <div id="Pergunta ${i+1}" class="whiteBox">
                <div class="row">
                    <h2>Pergunta ${i+1}</h2>
                    <ion-icon onclick="showQuestion(${i},this)" name="create-outline"></ion-icon>
                </div>
            </div>
            `;
        }
    }
    document.querySelector(".page").innerHTML+=`
    <div class="center">
        <button class="redBox" onclick="readQuizzPg2()">Prosseguir pra criar níveis</button>
    </div>
    `;
}
function showQuestion(i,element){
    element.classList.add("pointerEventsNone");
    document.getElementById(`Pergunta ${i+1}`).innerHTML+=`
            <input id="a${i+1}1" type="text" placeholder="Texto da pergunta" minlength="20">
            <input id="a${i+1}2" type="text" placeholder="Cor de fundo da pergunta">
            <h2>Resposta correta</h2>
            <input id="a${i+1}3" type="text" placeholder="Resposta correta">
            <input id="a${i+1}4" type="url" placeholder="URL de imagem">
            <h2>Respostas incorretas</h2>
            <input id="a${i+1}5" type="text" placeholder="Resposta incorreta 1">
            <input id="a${i+1}6" type="url" placeholder="URL de imagem 1">
            <input id="a${i+1}7" type="text" placeholder="Resposta incorreta 2">
            <input id="a${i+1}8" type="url" placeholder="URL de imagem 2">
            <input id="a${i+1}9" type="text" placeholder="Resposta incorreta 3">
            <input id="a${i+1}10" type="url" placeholder="URL de imagem 3">
    `;
}
function readQuizzPg2() {
    for(let i =0;i<questions;i++){
        question.title=document.getElementById(`a${i+1}1`).value;
        question.color=document.getElementById(`a${i+1}2`).value;
        
        answer.text=document.getElementById(`a${i+1}3`).value;
        if(answer.text==""){
            alert('Insira um texto para a resposta');
            return;
        }
        answer.image=document.getElementById(`a${i+1}4`).value;
        if(!isValidHttpUrl(answer.image)){
            alert('Insira uma url de imagem válida');
            return;
        }
        answer.isCorrectAnswer=true;
        question.answers[0]=answer;

        answer.text=document.getElementById(`a${i+1}5`).value;
        if(answer.text==""){
            alert('Insira um texto para a resposta');
            return;
        }
        answer.image=document.getElementById(`a${i+1}6`).value;
        if(!isValidHttpUrl(answer.image)){
            alert('Insira uma url de imagem válida');
            return;
        }
        answer.isCorrectAnswer=false;
        question.answers[1]=answer;

        answer.text=document.getElementById(`a${i+1}7`).value;
        answer.image=document.getElementById(`a${i+1}8`).value;
        answer.isCorrectAnswer=false;
        if(answer.text!=""){
            if(!isValidHttpUrl(answer.image)){
                alert('Insira uma url de imagem válida');
                return;
            } 
        }
        if(answer.text==""){
            question.answers[2]=emptyAnswer;
        }else{
            question.answers[2]=answer;
        }

        answer.text=document.getElementById(`a${i+1}9`).value;
        answer.image=document.getElementById(`a${i+1}10`).value;
        answer.isCorrectAnswer=false;
        if(answer.text!=""){
            if(!isValidHttpUrl(answer.image)){
                alert('Insira uma url de imagem válida');
                return;
            } 
        }
        if(answer.text==""){
            question.answers[3]=emptyAnswer;
        }else{
            question.answers[3]=answer;
        }

        if(question.title.length<20){
            alert(`Escolha um título com no mínimo 20 caractéres`);
            return;
        }
        if(!isValidColor(question.color)){
            alert('Insira uma cor válida');
            return;
        }
        createdQuizz.questions[i]=question;
    }
    createQuizzPg3();
}
function createQuizzPg3(){
    document.querySelector(".page").innerHTML=`
    <h2>Agora, decida os níveis</h2>
    `;
    for(let i =0;i<levels;i++){
        document.querySelector(".page").innerHTML+=`
        <div class="whiteBox">
            <h2>Nível ${i+1}</h2>
            <input id="a${i+1}1" type="text" placeholder="Título do nível" minlength="10">
            <input id="a${i+1}2" type="number" placeholder="% de acerto mínima">
            <input id="a${i+1}3" type="url" placeholder="URL da imagem do nível">
            <input id="a${i+1}4" type="text" placeholder="Descrição do nível" minlength="30">
        </div>
     `;
    }
    document.querySelector(".page").innerHTML+=`
    <button class="redBox" onclick="readQuizzPg3()">Finalizar Quizz</button>
    `;
}
function readQuizzPg3() {
    let hasZero=false;
    for(let i =0;i<levels;i++){
        level.title=document.getElementById(`a${i+1}1`).value;
        if(level.title.length<10 ){
            alert(`Escolha um título com no mínimo 10 caractéres`);
            return;
        }
        level.minValue=document.getElementById(`a${i+1}2`).value;
        if(level.minValue=="0"){
            hasZero=true;
        }
        if(!(level.minValue>=0 || level.minValue<=100)){
            alert('Insira um valor de 0 a 100 para o nível');
            return;
        }
        level.image=document.getElementById(`a${i+1}3`).value;
        if(!isValidHttpUrl(level.image)){
            alert('Insira uma url de imagem válida');
            return;
        }
        level.text=document.getElementById(`a${i+1}4`).value;
        if(level.text.length<30 ){
            alert(`Escolha uma descrição com no mínimo 30 caractéres`);
            return;
        }

        createdQuizz.levels[i]=level;
    }
    if(hasZero==false){
        alert("Pelo menos um dos níveis deve ter o valor 0");
        createQuizzPg3();
    }

    /////stringify para salvar na memoria
    //Stringify();

    /////////// posta quizz
    let promise=axios.post('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes',createdQuizz);
    //let getId = axios.get('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes') // add ~lucas
    //getId.then(getquizzId); // add ~lucas
    promise.then(refreshQuizzList);
    promise.then(getidServer);
}
let testquizz={
    "title": "Miranha no multiverso",
    "image": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
    "questions": [
        {
            "title": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
            "color": "#111111",
            "answers": [
                {
                    "text": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "image": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "isCorrectAnswer": true
                },
                {
                    "text": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "image": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "isCorrectAnswer": false
                }
            ]
        },
        {
            "title": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
            "color": "#333333",
            "answers": [
                {
                    "text": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "image": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "isCorrectAnswer": true
                },
                {
                    "text": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "image": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "isCorrectAnswer": false
                }
            ]
        },
        {
            "title": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
            "color": "#555555",
            "answers": [
                {
                    "text": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "image": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "isCorrectAnswer": true
                },
                {
                    "text": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "image": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
                    "isCorrectAnswer": false
                }
            ]
        }
    ],
    "levels": [
        {
            "title": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
            "image": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
            "text": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
            "minValue": 60
        },
        {
            "title": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
            "image": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
            "text": "https://nerdvision.com.br/wp-content/uploads/2021/08/homem-aranha-3-1.jpg",
            "minValue": 0
        }
    ]
};
function test(){
    let promise=axios.post('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes',testquizz);
    //let getId = axios.get('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes') // add ~lucas
    //getId.then(getquizzId); // add ~lucas
    promise.then(refreshQuizzList);
    promise.then(getidServer);
    console.log("entrei no test");
}

// function localStorage(idcriadoagr){
//     let listausuario = get localStorage;
//     listausuario=listausuario+idcriadoagr;
//     post locastorage listausuario;
// }

function getidServer(response){
    console.log(response);
    let myquizzid = response.data.id;
    console.log(myquizzid);
    myQuizz.push(myquizzid);
    console.log(myQuizz);
    inlocalStorage();
}

function inlocalStorage(){
    let quizzSerial = JSON.stringify(myQuizz);
    localStorage.setItem('list',quizzSerial)
    console.log(localStorage)
}

function outlocalStorage(){
    let list = localStorage.getItem('list')
    console.log(list)
    myQuizz = JSON.parse(list)
    console.log(myQuizz)
}

function refreshQuizzList(postedquizz){ ////show quizz n funcionando 
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes');
    promise.then(function a(quizzes){
        listaQuizz = quizzes.data;
        for(i = 0; i < listaQuizz.length; i++){ 
            if(postedquizz.data.id==listaQuizz[i].id){
                showingQuizzIndex=i;    
            }
        }
        postedQuizz(postedquizz);
    }
    );
    
}

function postedQuizz(quizz){ // TENTAR CONSERTAR CONFLITO COM O 'SHOWQUIZZ'. PROVAVELMENTE SEJA PQ QUIZZ.DATA.ID ENTRA EM CONFLITO COM O INDEX QUE RECEBE O PARAMETRO CITADO ANTERIORMENTE E ADICIONA .TITLE, DAI FICA QUIZZ.DATA.ID.TITLE, E CONFLITA PQ ELES NÃO TEM RELAÇÃO DE DEPENDENCIA.
    listaQuizz
    document.querySelector(".page").innerHTML=`
    <div class="column">
        <h2>Seu quizz está pronto</h2>
        <div id="${quizz.data.id}"  class="quizzBox"> 
            <img src="${quizz.data.image}" alt="thumb"> 
            <div class="gradient"> </div>
            <h1 class="QuizzTitle white "> ${quizz.data.title} </h1>  
        </div>
        <button class="redBox" onclick="showQuizz(${showingQuizzIndex})">Acessar Quizz</button>

        <h4 onclick="homePage()">Voltar pra home</h4>
    </div>
    
    `;
}


