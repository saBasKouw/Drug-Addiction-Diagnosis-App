class Quiz{
    constructor(questions){
        this.questions = questions;
        this.questionIndex = 0;
    }


    getQuestionWithIndex(){
        return this.questions[this.questionIndex];
    }

    isEnded(){
        return this.questions.length === this.questionIndex;
    }

    guess(answer){
        this.getQuestionWithIndex().answer = answer;
        this.questionIndex++;
    }
}