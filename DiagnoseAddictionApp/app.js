
let questions = [];


for(let question of questionData["domain"]["DSM5"]){
    questions.push(new Question(question['text'], question['choices']));
}

let quiz = new Quiz(questions);

let resultIsSent = false;






function chooseAnswer() {
    for (let i = 0; i < quiz.getQuestionWithIndex().choices.length; i++) {
        let button = document.getElementById('btn'+i);
        button.onclick = ()=> {
            quiz.guess(quiz.getQuestionWithIndex().choices[i]);
            $( ".buttons" ).empty();
            populate();

        }
    }
}

function resultDSM(result){
    let count = 0;
    for(let answer of result){
        if(answer === "yes"){
            count++;
        }
    }
    if(count < 2){
        console.log("No indication of alcohol abuse");
    } else if(count < 4){
        console.log("Mild indication of alcohol abuse");
    } else if(count < 6){
        console.log("Moderate indication of alcohol abuse");
    }  else if(count >= 6){
        console.log("Severe indication of alcohol abuse");
    }
}




function sendResult(){
    $("#sendResult").click(()=> {
        resultIsSent = true;
        let result = [];
        for(let i = 0; i < questions.length; i++){
            for(let j = 0; j < questions[i].choices.length; j++){
                let element = document.getElementById(i.toString() +"-"+ j.toString());
                if(element.checked){
                    result.push(questions[i].choices[j]);
                }
            }
        }
        resultDSM(result);
        populate();
    });
}

function populateQuestion(){
    let element = document.getElementById("question");
    element.innerHTML = quiz.getQuestionWithIndex().text;
    let newHtml = '';
    for(let i = 0; i < quiz.getQuestionWithIndex().choices.length; i++){
        newHtml += "<button id='btn"+i+"'><span id='choice"+i+"'>"+quiz.getQuestionWithIndex().choices[i]+"</span></button>"
    }
    $('.buttons').append(newHtml);

    chooseAnswer();
}





function showProgress(){
    let currentQuestionNumber = quiz.questionIndex + 1;
    let element = document.getElementById("progress");
    element.innerHTML = "Question "+ currentQuestionNumber+" of "+quiz.questions.length;
}

function showResult(){
    let gameOverHtml = "<h1>Result</h1>";
    for(let i = 0; i < questions.length; i++){
        gameOverHtml += "<p>"+ questions[i].text +"</p>";
        for(let j = 0; j < questions[i].choices.length; j++){
            let id = i.toString() +"-"+ j.toString();
            if(questions[i].isSame(questions[i].choices[j])){
                gameOverHtml += "<div> <input type='radio' name=question"+i+" id="+ id +" value=" + id + " checked> <label for="+id+">"+questions[i].choices[j]+"</label> </div>"
            } else {
                gameOverHtml += "<div> <input type='radio' name=question"+i+" id="+ id+" value=" + id + "> <label for="+id+">"+questions[i].choices[j]+"</label> </div>"
            }
        }
    }
    let element = document.getElementById("quiz");
    element.innerHTML = gameOverHtml;

    element = document.getElementById("progress");
    element.innerHTML = "<button id='sendResult'><span>Send result to doctor</span></button>";
}

function messageSent(){
    let element = document.getElementById("quiz");
    let gameOverHtml = "<h1>Result</h1>";
    gameOverHtml += "<h2>Thank you for participating. The results are sent to the doctor.</h2>"
    element.innerHTML = gameOverHtml;
    element = document.getElementById("progress");
    element.innerHTML = "";
}

function populate(){
    if(quiz.isEnded() && !resultIsSent){
        showResult();
        sendResult();
    } else if(resultIsSent){
        messageSent();
    } else {
        populateQuestion();
        showProgress();
    }
}


populate();