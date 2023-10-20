import { Competitor } from './Competitor';
import { Match } from './Match';

class Round {
    roundNumber: number;
    matches: Match[];

    constructor(roundNumber: number, matches: Match[]) {
        this.roundNumber = roundNumber;
        this.matches = matches;
    }
}

export { Round }