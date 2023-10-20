import { Competitor } from "./Competitor";
declare class Match {
    id: number;
    competitionId: number;
    competitor1Id: number;
    competitor2Id: number;
    round: number;
    score1: number | null;
    score2: number | null;
    competitor1?: Competitor;
    competitor2?: Competitor;
    constructor(id: number, competitionId: number, competitor1Id: number, competitor2Id: number, round: number, score1: number | null, score2: number | null);
}
export { Match };
