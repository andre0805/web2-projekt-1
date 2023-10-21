declare class Competitor {
    id: number;
    name: string;
    competitionId: number;
    wins: number;
    draws: number;
    losses: number;
    matchesPlayed: number;
    totalPoints: number;
    constructor(id: number, name: string, competitionId: number, wins: number, draws: number, losses: number);
}
export { Competitor };
