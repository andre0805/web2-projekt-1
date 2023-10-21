"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Competitor = void 0;
var Competitor = /** @class */ (function () {
    function Competitor(id, name, competitionId, wins, draws, losses) {
        this.totalPoints = 0;
        this.id = id;
        this.name = name;
        this.competitionId = competitionId;
    }
    return Competitor;
}());
exports.Competitor = Competitor;
