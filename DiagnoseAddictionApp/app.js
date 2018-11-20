let questions = [
    new Question("Which of the following substances do you most frequently use?", ["Alcohol", "Cocaine", "GHB", "Heroine"]),
    new Question("How often do you use this substance?", ["One time a week", "Two times a week", "Three times a week", "Everyday"]),
    new Question("How long have you been using this substance", ["Half a year", "One year", "Two years", "More than two years"])
];

let quiz = new Quiz(questions);

let resultIsSent = false;


function populate(){
    if(quiz.isEnded() && !resultIsSent){

        showResult();


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
            console.log(result);
            populate();
        });

        for(let question of questions){
            console.log(question.answer);
        }


    } else if(resultIsSent) {
        let element = document.getElementById("quiz");
        let gameOverHtml = "<h1>Result</h1>";
        gameOverHtml += "<h2>Thank you for participating. The results are sent to the doctor.</h2>"
        element.innerHTML = gameOverHtml;
        element = document.getElementById("progress");
        element.innerHTML = "";


    } else{
    //    show question
        let element = document.getElementById("question");
        element.innerHTML = quiz.getQuestionIndex().text;
        //show choices
        let choices = quiz.getQuestionIndex().choices;
        for(let i = 0; i < choices.length; i++){
            let element = document.getElementById("choice"+i);
            element.innerHTML = choices[i];
            guess("btn"+ i, choices[i]);
        }
        showProgress();
    }
}

function guess(id, guess){
    let button = document.getElementById(id);
    button.onclick = ()=> {
        quiz.guess(guess);
        populate();

    }
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

populate();