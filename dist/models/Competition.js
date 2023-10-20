"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Competition = void 0;
var Competition = /** @class */ (function () {
    function Competition(id, name, creatorUserId, winPoints, drawPoints, lossPoints) {
        this.id = id;
        this.name = name;
        this.creatorUserId = creatorUserId;
        this.winPoints = winPoints;
        this.drawPoints = drawPoints;
        this.lossPoints = lossPoints;
    }
    return Competition;
}());
exports.Competition = Competition;
