class Player {
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.score = 0;

    }
    setScore(action){
        this.score = this.score += action.payload;
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
}

module.exports = Player;