"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
var Match = /** @class */ (function () {
    function Match(id, competitionId, competitor1Id, competitor2Id, round, score1, score2) {
        this.id = id;
        this.competitionId = competitionId;
        this.competitor1Id = competitor1Id;
        this.competitor2Id = competitor2Id;
        this.round = round;
        this.score1 = score1;
        this.score2 = score2;
    }
    return Match;
}());
exports.Match = Match;
