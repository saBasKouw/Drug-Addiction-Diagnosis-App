

let domainIndex = 0;
let domains = Object.keys(questionData["domain"]);
let results = {};

//This is a dictionary with the name of the important context as a key
// and the number of the question that belongs to this context as value
let neededContext = {"withdrawal": [16], "devoted": [11], "craving": [12], "affect_school": [12, 27],
    "household": [27,28], "hazardous_circumstances": [13], "own_threat": [23, 14, 13, 17, 7],
    "other_threat": [22, 24, 25, 13], "care_of_himself": [18, 19, 33], "influence": [34, 35, 21],
    "lonely": [21, 30, 36, 33, 38], "use_alone": [20, 21, 30], "did_stop": [2, 3],
    "severity": [2, 4, 11, 12, 13, 14, 15, 16, 27, 28, 29]};

// In the variable below the answers to the questions will be stored,
//when we look at the inference structure this can be considered as the 'case'
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
            for(let question of result){
                answers.push(question)
            }
            populate();
        });
    }

    function populateQuestion(){
        //Populates a question with the necessary text and answers to choose from.
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
        //Shows per domain at which question you are
        let currentQuestionNumber = quiz.questionIndex + 1;
        let element = document.getElementById("progress");
        element.innerHTML = "Question "+ currentQuestionNumber+" of "+quiz.questions.length;
    }

    function showResult(){
        //after all the questions are answered of a domain the user get the chance to
        // revise the answers given. This function populates the app with the necessary html
        let reviseHtml = "<h1>Revise</h1>";
        for(let i = 0; i < questions.length; i++){
            reviseHtml += "<p>"+ questions[i].text +"</p>";
            for(let j = 0; j < questions[i].choices.length; j++){
                let id = i.toString() +"-"+ j.toString();
                if(questions[i].isSame(questions[i].choices[j])){
                    reviseHtml += "<div> <input type='radio' name=question"+i+" id="+ id +" value=" + id + " checked> <label for="+id+">"+questions[i].choices[j]+"</label> </div>"
                } else {
                    reviseHtml += "<div> <input type='radio' name=question"+i+" id="+ id+" value=" + id + "> <label for="+id+">"+questions[i].choices[j]+"</label> </div>"
                }
            }
        }
        let element = document.getElementById("quiz");
        element.innerHTML = reviseHtml;
        element = document.getElementById("progress");

        //if all the questions of each domain are answered the user gets the chose to
        //sent the result to the doctor, if this is not te case a new domain with new answers
        //will be provided to the user
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


    function abstraction(key){
        //This function evaluates if the answer given to one of the questions of a specific domain
        //is an answer which will trigger the score to go up.
        let counter = 0;
        for(let questionNumber of neededContext[key]){
            //The neededContext[key] can be considered to be the abstraction_method
            // The questions from the neededContext are called and extracted from the answers aka case
            // Together the linked questions to each neededContext can be considered to be the
            // abstracted case in the inference structure.
            if(answers[questionNumber-1] === "Ja" ||
                (questionNumber === 33 && answers[questionNumber-1] === "Één jaar gewerkt") ||
                (questionNumber === 33 && answers[questionNumber-1] === "Niet gewerkt") ||
                (questionNumber === 30 && answers[questionNumber-1] === "Alleenwonend") ||
                (questionNumber === 3 && answers[questionNumber-1] === "Mijn gebruik is afgenomen") ||
                (questionNumber === 3 && answers[questionNumber-1] === "Mijn gebruik was gestopt")){

                counter++;
            }
        }

        results[key] = counter+'/'+neededContext[key].length;
    }


    function resultDSM(score){
        //The DSM score is determined by using this function. THis function represents the
        // evaluates inference
        let count = parseInt(score[0]);
        let result;
        //The code block below represents the decision_method
        if(count < 2){
            result = "<span class='bold'>No indication of "+ answers[0].toLowerCase() +" abuse</span>";
        } else if(count < 4){
            result = "<span class='bold'>Mild indication of "+ answers[0].toLowerCase() +" abuse</span>";
        } else if(count < 6){
            result = "<span class='bold'>Moderate indication of "+ answers[0].toLowerCase() +" abuse</span>";
        }  else if(count >= 6){
            result = "<span class='bold'>Severe indication of "+ answers[0].toLowerCase() +" abuse</span>";
        } return result;
    }


    function assignLevel(score){
        //For scores other than DSM this function will decide if the score is mild, moderate or severe
        // THis function represents the evaluates inference
        let count = parseInt(score[0]);
        //The code block below represents the decision_method
        if(count === 0){
            return "<span class='bold'>No indication</span>";
        } else if(count < 2){
            return "<span class='bold'>Mild indication</span>";
        } else if(count < 3){
            return "<span class='bold'>Moderate indication</span>";
        } else{
            return "<span class='bold'>Severe indication</span>";
        }
    }

    function assignBool(score){
        //if a domain has less than 3 questions a boolean decision will be given which represents
        // if there is an indication or not. This function will either assign a green check mark
        // or a red cross.
        // THis function represents the evaluates inference
        let count = parseInt(score[0]);
        //the if statement is the match, the count is the norm value and the return statement consist of
        // the decision.
        //The code block below represents the decision_method
        if(count > 0){
            return "<span class='greenText'>&#x2714;</span>";
        } else{
            return "<span class='redText'>&#x274C;</span>";
        }
    }

    function whichResult(key){
        //this specifies the norm method. It will be either DSM, an indication in levels,
        // or if there is less than 3 questions a boolean indication.
        // The code block below represents the norms block in the inference structure
        let score = results[key];
        let total = parseInt(score[2]);
        //Each of the following statement can trigger one norm of the norms.
        if(key === "severity"){
            return resultDSM(results[key]);
        } else if(total > 2){
            return assignLevel(score, key);
        } else {
            return assignBool(score);
        }
    }


    function generateOverview(){
        //This function generates the overview with all the results using the answers extracted
        //from the questionnaire. In order to generate the results the abstraction is made
        // //by using the whichResult function.

        // Every concatenation of the html string below represents the append to inference in the
        // inference structure
        let element = document.getElementById("quiz");
        let overviewHtml = "<h1>Overview</h1>";
        overviewHtml += "<p>The patient is addicted to: "+ "<span class='bold'>"+answers[0]+"</span></p>"+
            "<p>The patient is in withdrawal: "+ whichResult("withdrawal") +"</p>"+
            "<p>The patient devotes substantial time to facilitate their use: "+ whichResult("devoted") +"</p>"+
            "<p>The patient has a strong desire to use which makes it difficult to think of anything else: "+ whichResult("craving") +"</p>"+
            "<p>The patient's use affects his school or work: "+ whichResult("affect_school") +"</p>"+
            "<p>The patient might neglect their household responsibilities or child care: "+ whichResult("household") +"</p>"+
            "<p>The patient uses in potential hazardous circumstances: "+ whichResult("hazardous_circumstances") +"</p>"+
            "<p>The patient is a threat to themselves: "+ whichResult("own_threat") +"</p>"+
            "<p>The patient is a threat to others: "+ whichResult("other_threat") +"</p>"+
            "<p>The patient does not take care of themselves: "+ whichResult("care_of_himself") +"</p>"+
            "<p>The patient is influenced by others to use: "+ whichResult("influence") +"</p>"+
            "<p>The patient is lonely and this has affect on their use: "+ whichResult("lonely") +"</p>"+
            "<p>The patient has on occasion tried to stop using: "+ whichResult("did_stop") +"</p>"+
            "<p>The severity of the patient's use is: "+ whichResult("severity") +"</p>";
        element.innerHTML = overviewHtml;
        element = document.getElementById("progress");
        element.innerHTML = "";
    }


    function generateResult(){
        //This function will call every important context key so that the result can be
        //generated using the evaluate function. and after that it call the generateOverview function.
        let result;
        for(let key in neededContext){
            result = abstraction(key);
        }
        generateOverview();
    }


    function populate(){
        //This functions is responsible for handling all the dynamic interaction with the app
        // if the quiz is ended and the user did not decide to sent the results  yet
        // The app will show the result
        //if the user chooses to sent the result it will either generate the result if all the questions are answered
        // or again call the populate all function to repopulate the app with new html etc
        //If this is all not the case it will just populate a question with html and show the progress.
        if(quiz.isEnded() && !resultIsSent){
            showResult();
            nextPage();
        } else if(resultIsSent) {
            if (domainIndex === domains.length-1) {
                // messageSent();
                generateResult();
            } else {
                domainIndex++;
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
