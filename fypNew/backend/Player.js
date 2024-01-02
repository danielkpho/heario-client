class Player {
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.score = 0;

    }
    setScore(action){
        this.score += action;
    }
    getScore(){
        return this.score;
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
}

module.exports = Player;