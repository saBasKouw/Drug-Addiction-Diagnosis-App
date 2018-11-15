class Quiz{
    constructor(questions){
        this.questions = questions;
        this.questionIndex = 0;
    }


    getQuestionIndex(){
        return this.questions[this.questionIndex];
    }

    isEnded(){
        return this.questions.length === this.questionIndex;
    }

    guess(answer, question){
        this.questionIndex++;
        question.answer = answer;
    }
}