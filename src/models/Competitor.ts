class Competitor {
    id: number;
    name: string;
    competitionId: number;
    wins: number;
    draws: number;
    losses: number;

    totalPoints: number = 0;

    constructor(id: number, name: string, competitionId: number, wins: number, draws: number, losses: number) {
        this.id = id;
        this.name = name;
        this.competitionId = competitionId;
    }
}

export { Competitor }
