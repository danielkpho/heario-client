class Player {
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.score = 0;
        this.data = [];
    }
    setScore(action){
        this.score += action;
    }
    getScore(){
        return this.score;
    }
    setData(data){
        this.data = data;
    }
    getData(){
        return this.data;
    }
    getName(){
        return this.name;
    }
    getId(){
        return this.id;
    }
    resetScore(){
        this.score = 0;
    }
    resetTries(){
        this.tries = 0;
    }
    resetAccuracy(){
        this.accuracy = 0;
    }
}

module.exports = Player;