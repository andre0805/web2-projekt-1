"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_openid_connect_1 = require("express-openid-connect");
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var client_1 = require("@prisma/client");
var middleware = __importStar(require("./middleware"));
var Competitor_1 = require("./models/Competitor");
var Match_1 = require("./models/Match");
var Round_1 = require("./models/Round");
var host = process.env.HOST || 'localhost';
var port = process.env.PORT || 3000;
var app = (0, express_1.default)();
var viewsPath = path_1.default.join(__dirname, 'views');
app.set("views", viewsPath);
app.set("view engine", "pug");
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('styles'));
dotenv_1.default.config();
var config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: "http://".concat(host, ":").concat(port),
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://dev-gzizuvkh2i7yo8yr.us.auth0.com',
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email',
    },
};
var prisma = new client_1.PrismaClient();
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use((0, express_openid_connect_1.auth)(config));
// req.isAuthenticated is provided from the auth router
app.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            if (req.oidc.isAuthenticated()) {
                res.render('index', { user: req.oidc.user });
            }
            else {
                res.render('index', { user: null });
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: error.message || error });
        }
        return [2 /*return*/];
    });
}); });
app.get('/competitions', (0, express_openid_connect_1.requiresAuth)(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var competitions, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.competitions.findMany({
                        orderBy: {
                            name: 'asc',
                        },
                        where: {
                            creatorUserId: req.oidc.user.sub,
                        }
                    })];
            case 1:
                competitions = _a.sent();
                res.render('competitions', { user: req.oidc.user, competitions: competitions });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching data:', error_1);
                res.status(500).json({ error: error_1.message || error_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/competitions', (0, express_openid_connect_1.requiresAuth)(), middleware.validateCompetitionData, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var competitionName, scoringSystem, winPoints, drawPoints, lossPoints, competition_1, competitors, _i, competitors_1, competitor, dbCompetitor, dummyId, dummyCompetitor, competitorsCount, roundsCount, matchesPerRound, competitorsIds, matches, round, roundMatches, i, competitor1Id, competitor2Id, match, _a, matches_1, match, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                competitionName = req.body.competitionName.trim();
                scoringSystem = req.body.scoringSystem.replaceAll(',', '.').split('/').map(function (x) { return parseFloat(x); });
                winPoints = scoringSystem[0];
                drawPoints = scoringSystem[1];
                lossPoints = scoringSystem[2];
                return [4 /*yield*/, prisma.competitions.create({
                        data: {
                            name: competitionName,
                            creatorUserId: req.oidc.user.sub,
                            winPoints: winPoints,
                            drawPoints: drawPoints,
                            lossPoints: lossPoints,
                        }
                    })];
            case 1:
                competition_1 = _b.sent();
                competitors = req.body.competitors
                    .replaceAll('\n', ';')
                    .replaceAll('\r', ';')
                    .split(';')
                    .filter(function (competitor) { return competitor.trim().length > 0; })
                    .map(function (competitor, i) { return new Competitor_1.Competitor(i, competitor.trim(), competition_1.id, 0, 0, 0); });
                _i = 0, competitors_1 = competitors;
                _b.label = 2;
            case 2:
                if (!(_i < competitors_1.length)) return [3 /*break*/, 5];
                competitor = competitors_1[_i];
                return [4 /*yield*/, prisma.competitors.create({
                        data: {
                            name: competitor.name,
                            competitionId: competition_1.id,
                        }
                    })];
            case 3:
                dbCompetitor = _b.sent();
                competitor.id = dbCompetitor.id;
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                dummyId = -1;
                if (competitors.length % 2 == 1) {
                    dummyCompetitor = new Competitor_1.Competitor(dummyId, 'Dummy', competition_1.id, 0, 0, 0);
                    competitors.push(dummyCompetitor);
                }
                competitorsCount = competitors.length;
                roundsCount = competitorsCount - 1;
                matchesPerRound = Math.floor(competitorsCount / 2);
                competitorsIds = competitors.map(function (competitor) { return competitor.id; });
                matches = [];
                for (round = 0; round < roundsCount; round++) {
                    roundMatches = [];
                    for (i = 0; i < matchesPerRound; i++) {
                        competitor1Id = competitorsIds[i];
                        competitor2Id = competitorsIds[competitorsCount - i - 1];
                        if (competitor1Id == dummyId || competitor2Id == dummyId) {
                            continue;
                        }
                        match = new Match_1.Match(i, competition_1.id, competitor1Id, competitor2Id, round + 1, null, null);
                        roundMatches.push(match);
                    }
                    matches.push.apply(matches, roundMatches);
                    // rotate competitors so that each competitor plays with a different competitor
                    competitorsIds.splice(1, 0, competitorsIds.pop());
                }
                _a = 0, matches_1 = matches;
                _b.label = 6;
            case 6:
                if (!(_a < matches_1.length)) return [3 /*break*/, 9];
                match = matches_1[_a];
                return [4 /*yield*/, prisma.matches.create({
                        data: {
                            competitionId: match.competitionId,
                            competitor1Id: match.competitor1Id,
                            competitor2Id: match.competitor2Id,
                            round: match.round,
                        }
                    })];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                _a++;
                return [3 /*break*/, 6];
            case 9:
                res.redirect('/');
                return [3 /*break*/, 11];
            case 10:
                error_2 = _b.sent();
                console.error('Error inserting data:', error_2);
                res.status(500).json({ error: error_2.message || error_2 });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
app.get('/competitions/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var competitionId, competition_2, competitors, matches, matchesByRound, _loop_1, _i, matches_2, match, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                competitionId = parseInt(req.params.id);
                return [4 /*yield*/, prisma.competitions.findUnique({
                        include: {
                            competitors: {
                                orderBy: {
                                    name: 'asc',
                                }
                            },
                            matches: {
                                orderBy: [
                                    {
                                        round: 'asc',
                                    },
                                    {
                                        id: 'asc',
                                    }
                                ]
                            }
                        },
                        where: {
                            id: competitionId,
                        },
                    })];
            case 1:
                competition_2 = _a.sent();
                if (competition_2 == null) {
                    res.status(404).send('Competition not found');
                    return [2 /*return*/];
                }
                competitors = competition_2.competitors
                    .map(function (competitor) {
                    competitor.totalPoints = competitor.wins * competition_2.winPoints
                        + competitor.draws * competition_2.drawPoints
                        + competitor.losses * competition_2.lossPoints;
                    return competitor;
                })
                    .sort(function (a, b) { return b.totalPoints - a.totalPoints; });
                matches = competition_2.matches;
                matchesByRound = [];
                _loop_1 = function (match) {
                    if (matchesByRound[match.round - 1] == null) {
                        matchesByRound[match.round - 1] = new Round_1.Round(match.round, []);
                    }
                    // add competitors to matches
                    match.competitor1 = competitors.find(function (competitor) { return competitor.id == match.competitor1Id; });
                    match.competitor2 = competitors.find(function (competitor) { return competitor.id == match.competitor2Id; });
                    matchesByRound[match.round - 1].matches.push(match);
                };
                for (_i = 0, matches_2 = matches; _i < matches_2.length; _i++) {
                    match = matches_2[_i];
                    _loop_1(match);
                }
                // sort matches by round
                matchesByRound.sort(function (a, b) { return a.roundNumber - b.roundNumber; });
                res.render('competition', { user: req.oidc.user, competition: competition_2, competitors: competitors, matchesByRound: matchesByRound });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching data:', error_3);
                res.status(500).json({ error: error_3.message || error_3 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/matches/:matchId', (0, express_openid_connect_1.requiresAuth)(), middleware.validateMatchData, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var matchId, score1, score2, match, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                matchId = parseInt(req.params.matchId);
                score1 = parseInt(req.body.score1);
                score2 = parseInt(req.body.score2);
                return [4 /*yield*/, prisma.matches.findUnique({
                        where: {
                            id: matchId,
                        }
                    })];
            case 1:
                match = _a.sent();
                console.log("match: ".concat(JSON.stringify(match)));
                if (match == null || match == undefined) {
                    res.status(404).send('Match not found');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, prisma.matches.update({
                        where: {
                            id: matchId,
                        },
                        data: {
                            score1: score1,
                            score2: score2,
                        }
                    })];
            case 2:
                _a.sent();
                res.redirect("/competitions/".concat(match.competitionId));
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Error inserting data:', error_4);
                res.status(500).json({ error: error_4.message || error_4 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/signup", function (req, res) {
    res.oidc.login({
        returnTo: '/',
        authorizationParams: {
            screen_hint: "signup",
        },
    });
});
app.listen(port, function () {
    console.log("viewsPath: " + viewsPath);
    console.log("Listening at https://".concat(host, ":").concat(port));
});
