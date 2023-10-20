"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMatchData = exports.validateCompetitionData = void 0;
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var app = (0, express_1.default)();
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "pug");
var validateCompetitionData = function (req, res, next) {
    var competitionName = req.body.competitionName;
    var competitors = req.body.competitors.replaceAll(';', '\n').split('\n').filter(function (x) { return x.trim().length > 0; });
    var scoringSystem = req.body.scoringSystem.replaceAll(',', '.').split('/').map(function (x) { return parseFloat(x); });
    var winPoints = scoringSystem[0];
    var drawPoints = scoringSystem[1];
    var lossPoints = scoringSystem[2];
    if (competitionName.length == 0) {
        res.render('index', { user: req.oidc.user, error: 'Invalid competition name' });
        ;
        return;
    }
    if (competitors.length < 4 || competitors.length > 8) {
        res.render('index', { user: req.oidc.user, error: 'Invalid number of competitors' });
        return;
    }
    if (typeof winPoints !== 'number' || typeof drawPoints !== 'number' || typeof lossPoints !== 'number' ||
        typeof winPoints === 'undefined' || typeof drawPoints === 'undefined' || typeof lossPoints === 'undefined' ||
        isNaN(winPoints) || isNaN(drawPoints) || isNaN(lossPoints)) {
        res.render('index', { user: req.oidc.user, error: 'Invalid scoring system' });
        return;
    }
    next();
};
exports.validateCompetitionData = validateCompetitionData;
var validateMatchData = function (req, res, next) {
    var score1 = req.body.score1;
    var score2 = req.body.score2;
    if (typeof score1 !== 'number' || typeof score2 !== 'number' ||
        typeof score1 === 'undefined' || typeof score2 === 'undefined' ||
        isNaN(score1) || isNaN(score2)) {
        res.render("/competitions/".concat(req.params.competitionId), { user: req.oidc.user, error: 'Invalid match data' });
        return;
    }
    next();
};
exports.validateMatchData = validateMatchData;
