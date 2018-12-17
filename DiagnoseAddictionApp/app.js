

let domainIndex = 0;
let domains = Object.keys(questionData["domain"]);
let results = {};
let neededContext = {"withdrawal": [16], "devoted": [11], "craving": [12], "affect_school": [12, 27],
    "household": [27,28], "hazardous_circumstances": [13], "own_threat": [23, 14, 13, 17, 7],
    "other_threat": [22, 24, 25, 13], "care_of_himself": [18, 19, 33], "influence": [34, 35, 21],
    "lonely": [21, 30, 36, 33, 38], "use_alone": [20, 21, 30], "did_stop": [2, 3],
    "severity": [2, 4, 11, 12, 13, 14, 15, 16, 27, 28, 29]};
let answers = [];

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
        //Populates a quiz object with questions from each domain starting with the first domain in questionData
        for(let question of questionData["domain"][domains[domainIndex]]){
            questions.push(new Question(question['text'], question['choices']));
        }
        quiz = new Quiz(questions);
    }


    function chooseAnswer() {
        //When a button is clicked an answer is given to a question, accordingly this answered is stored in
        // the question class. after a button is clicked the html is removed to make place for a new html.
        for (let i = 0; i < quiz.getQuestionWithIndex().choices.length; i++) {
            let button = document.getElementById('btn'+i);
            button.onclick = ()=> {
                quiz.guess(quiz.getQuestionWithIndex().choices[i]);
                $( ".buttons" ).empty();
                populate();

            }
        }
    }

    function resultDSM(score){
        //The DSM score is calculated by using this function.
        let count = parseInt(score[0]);
        let result;
        if(count < 2){
            result = "No indication of alcohol abuse";
        } else if(count < 4){
            result = "Mild indication of alcohol abuse";
        } else if(count < 6){
            result = "Moderate indication of alcohol abuse";
        }  else if(count >= 6){
            result = "Severe indication of alcohol abuse";
        } return result;
    }


    function nextPage(){
        //If the nextPage button is clicked the answers of the domain quiz that the patient just finished are stored to
        // the result and the answers are
        $("#nextPage").click(()=> {
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
            for(let question of quiz.questions){
                answers.push(question.answer)
            }
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
            element.innerHTML = "<button id='nextPage'><span>Sent result to doctor</span></button>";
        } else {
            element.innerHTML = "<button id='nextPage'><span>Next</span></button>";
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


    function checkIfSo(key){
        let counter = 0;
        for(let i of neededContext[key]){
            if(answers[i-1] === "Ja" || (i === 33 && answers[i-1] !== "Één jaar gewerkt") ||
                (i === 30 && answers[i-1] === "Alleenwonend") || (i === 3 && answers[i-1] === "Mijn gebruik is afgenomen") ||
                (i === 3 && answers[i-1] === "Mijn gebruik was gestopt")){
                counter++;
            }
        }
        results[key] = counter+'/'+neededContext[key].length;
    }


    function generateOverview(){
        let element = document.getElementById("quiz");
        let gameOverHtml = "<h1>Overview</h1>";
        gameOverHtml += "<p>The patient is addicted to: "+ answers[0] +"</p>"+
            "<p>The patient is in withdrawal: "+ results["withdrawal"] +"</p>"+
            "<p>The patient devotes substantial time to facilitate their use: "+ results["devoted"] +"</p>"+
            "<p>The patient has a strong desire to use which makes it difficult to think of anything else: "+ results["craving"] +"</p>"+
            "<p>The patient's use affects his school or work: "+ results["affect_school"] +"</p>"+
            "<p>The patient might neglect their household responsibilities or child care: "+ results["household"] +"</p>"+
            "<p>The patient uses in potential hazardous circumstances: "+ results["hazardous_circumstances"] +"</p>"+
            "<p>The patient is a threat to themselves: "+ results["own_threat"] +"</p>"+
            "<p>The patient is a threat to others: "+ results["other_threat"] +"</p>"+
            "<p>The patient does not take care of themselves: "+ results["care_of_himself"] +"</p>"+
            "<p>The patient is influenced by others to use: "+ results["influence"] +"</p>"+
            "<p>The patient is lonely and this has affect on their use: "+ results["lonely"] +"</p>"+
            "<p>The patient has on occasion tried to stop using: "+ results["did_stop"] +"</p>"+
            "<p>The severity of the patient's use is: "+ resultDSM(results["severity"]) +"</p>";
        element.innerHTML = gameOverHtml;
        element = document.getElementById("progress");
        element.innerHTML = "";
    }


    function generateResult(){
        let result;
        for(let key in neededContext){
            result = checkIfSo(key);
        }
        generateOverview();
    }


    function populate(){
        if(quiz.isEnded() && !resultIsSent){
            showResult();
            nextPage();
        } else if(resultIsSent) {
            if (domainIndex === domains.length-1) {
                // messageSent();
                generateResult();
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
console.log(results);
