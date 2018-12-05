

let domainIndex = 0;
let domains = Object.keys(questionData["domain"]);
let results = [];

function populateAll(){


    let element = document.getElementById("quiz");
    element.innerHTML = "<h1>"+domains[domainIndex]+"</h1>\n" +
        "        <hr style=\"margin-top: 20px\">\n" +
        "\n" +
        "        <p id=\"question\"></p>\n" +
        "\n" +
        "        <div class=\"buttons\">\n" +
        "        </div>";



    let questions = [];
    let quiz;

    populateQuiz();

    let resultIsSent = false;


    function populateQuiz(){
        for(let question of questionData["domain"][domains[domainIndex]]){
            questions.push(new Question(question['text'], question['choices']));
        }
        quiz = new Quiz(questions);
    }


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
        result = [];
        if(count < 2){
            result = "No indication of alcohol abuse";
        } else if(count < 4){
            result = "Mild indication of alcohol abuse";
        } else if(count < 6){
            result = "Moderate indication of alcohol abuse";
        }  else if(count >= 6){
            result = "Severe indication of alcohol abuse";
        } results.push(result);
    }

    function whichResult(result){
        if(domains[domainIndex] === "DSM5"){
            resultDSM(result);
        } else if(domains[domainIndex] === "background") {
            console.log("background result");
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
            whichResult(result);
            populate();
        });
    }

    function populateQuestion(){
        let element = document.getElementById("question");
        element.innerHTML = quiz.getQuestionWithIndex().text;
        let newHtml = '';
        for(let i = 0; i < quiz.getQuestionWithIndex().choices.length; i++){
            newHtml += "<button class='btn' id='btn"+i+"'><span id='choice"+i+"'>"+quiz.getQuestionWithIndex().choices[i]+"</span></button>"
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
        let gameOverHtml = "<h1>Revise</h1>";
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
        if(domainIndex === domains.length-1){
            element.innerHTML = "<button id='sendResult'><span>Sent result to doctor</span></button>";
        } else {
            element.innerHTML = "<button id='sendResult'><span>Next</span></button>";
        }

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
        } else if(resultIsSent) {
            if (domainIndex === domains.length-1) {
                messageSent();
            } else {
                domainIndex++
                populateAll();
            }
        } else {
            populateQuestion();
            showProgress();
        }
    }

    populate();
}


populateAll();
