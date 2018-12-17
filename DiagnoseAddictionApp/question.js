class Question{
    constructor(text, choices, answer){
        this.text = text;
        this.choices = choices;
        this.answer = answer;
    }

    isSame(otherAnswer){
        return this.answer === otherAnswer;
    }


}