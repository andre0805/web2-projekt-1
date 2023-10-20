import { Competitor } from "./Competitor";

class Match {
    id: number;
    competitionId: number;
    competitor1Id: number;
    competitor2Id: number;
    round: number;
    score1: number | null;
    score2: number | null;

    competitor1?: Competitor;
    competitor2?: Competitor;

    constructor(id: number, competitionId: number, competitor1Id: number, competitor2Id: number, round: number, score1: number | null, score2: number | null) {
        this.id = id;
        this.competitionId = competitionId;
        this.competitor1Id = competitor1Id;
        this.competitor2Id = competitor2Id;
        this.round = round;
        this.score1 = score1;
        this.score2 = score2;
    }
}

export { Match }
