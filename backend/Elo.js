function calculateElo(players, kFactor =  32) {
    // Sort players by score in descending order
    const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);

    // Helper function to calculate the expected score
    const expectedScore = (self, opponent) =>  1 / (1 +  10 ** ((opponent - self) /  400));

    // Helper function to calculate the new rating
    const newRating = (player, i) => {
        let ratingChange =   0;
        console.log("player rank: ", player.rank, "rating change: ", ratingChange, "new rank: ", player.rank + ratingChange)
        for (let j = 0; j < sortedPlayers.length; j++) {
            if (i !== j) {
                const opponent = sortedPlayers[j];
                const expectedOutcome = expectedScore(player.rank, opponent.rank);
                const actualOutcome = player.score > opponent.score ?   1 : (player.score < opponent.score ?  0 :  0.5); // Handle draws
                ratingChange += Math.round(kFactor * (actualOutcome - expectedOutcome));
                console.log(`Player ${player.name} vs ${opponent.name}: Expected Outcome = ${expectedOutcome}, Actual Outcome = ${actualOutcome}, Rating Change = ${kFactor * (actualOutcome - expectedOutcome)}`);
            }
        }
        console.log("player rank: ", player.rank, "rating change: ", ratingChange, "new rank: ", player.rank + ratingChange)
        return player.rank + ratingChange;
    };

    // Calculate the new ratings for each player
    const newRatings = sortedPlayers.map(newRating);

    // Update the players' ranks with the new ratings
    Object.keys(players).forEach((key, i) => {
        players[key].rank = newRatings[i];
    });

    // Return the updated players object
    return players;
}

module.exports = { calculateElo };
