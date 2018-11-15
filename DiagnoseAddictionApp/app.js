let questions = [
    new Question("Which of the following substances do you most frequently use?", ["Alcohol", "Cocaine", "GHB", "Heroine"]),
    new Question("How often do you use this substance?", ["One time a week", "Two times a week", "Three times a week", "Everyday"]),
    new Question("How long have you been using this substance", ["Half a year", "One year", "Two years", "More than two years"])
];

let quiz = new Quiz(questions);


function populate(){
    if(quiz.isEnded()){
        showEndMessage();

        for(let question of questions){
            console.log(question.answer);
        }
        
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

function showEndMessage(){
    let gameOverHtml = "<h1>Result</h1>";
    gameOverHtml += "<h2 id='score'>Thank you for filling the intake! Your results are sent to your doctor. </h2>";
    let element = document.getElementById("quiz");
    element.innerHTML = gameOverHtml;
}

populate();