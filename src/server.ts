import express from 'express';
import { auth, requiresAuth } from 'express-openid-connect';
import path from 'path';
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client';
import * as middleware from './middleware'
import { Competition } from './models/Competition';
import { Competitor } from './models/Competitor';
import { Match } from './models/Match';
import { Round } from './models/Round';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('styles'));

dotenv.config()

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: `http://${host}:${port}`,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://dev-gzizuvkh2i7yo8yr.us.auth0.com',
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email',
    },
};

const prisma = new PrismaClient();

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', async (req, res) => {
    try {
        if (req.oidc.isAuthenticated()) {
            res.render('index', { user: req.oidc.user });
        } else {
            res.render('index', { user: null });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: error.message || error });
    }
    
});

app.get('/competitions', requiresAuth(), async (req, res) => {
    try {
        const competitions: Competition[] = await prisma.competitions.findMany({
            orderBy: {
                name: 'asc',
            },
            where: {
                creatorUserId: req.oidc.user!.sub,
            }
        });

        res.render('competitions', { user: req.oidc.user, competitions });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: error.message || error });
    }
});

app.post('/competitions', requiresAuth(), middleware.validateCompetitionData, async (req, res) => {
    try {
        const competitionName = req.body.competitionName.trim();        
        const scoringSystem: number[] = req.body.scoringSystem.replaceAll(',', '.').split('/').map((x: string) => parseFloat(x));
        const winPoints: number = scoringSystem[0];
        const drawPoints: number = scoringSystem[1];
        const lossPoints: number = scoringSystem[2];
        
        // Create a new competition        
        const competition: Competition = await prisma.competitions.create({
            data: {
                name: competitionName,
                creatorUserId: req.oidc.user!.sub,
                winPoints: winPoints,
                drawPoints: drawPoints,
                lossPoints: lossPoints,
            }
        });

        let competitors: Competitor[] = req.body.competitors
            .replaceAll('\n', ';')
            .replaceAll('\r', ';')
            .split(';')
            .filter((competitor: string) => competitor.trim().length > 0)
            .map((competitor: string, i: number) => new Competitor(i, competitor.trim(), competition.id, 0, 0, 0));

        // Add competitors to the competition
        for (let competitor of competitors) {
            let dbCompetitor = await prisma.competitors.create({
                data: {
                    name: competitor.name,
                    competitionId: competition.id,
                }
            })
            competitor.id = dbCompetitor.id;
        }

        // if the number of competitors is odd, add a dummy competitor which will be skipped in the matches
        const dummyId = -1;
        if (competitors.length % 2 == 1) {
            const dummyCompetitor = new Competitor(dummyId, 'Dummy', competition.id, 0, 0, 0);
            competitors.push(dummyCompetitor);
        }

        // generate matches for the competition (each by each) by rounds
        const competitorsCount = competitors.length;
        const roundsCount = competitorsCount - 1;
        const matchesPerRound = Math.floor(competitorsCount / 2);
        const competitorsIds = competitors.map((competitor: Competitor) => competitor.id);

        const matches: Match[] = [];

        for (let round = 0; round < roundsCount; round++) {
            
            const roundMatches: Match[] = [];
            
            for (let i = 0; i < matchesPerRound; i++) {
                const competitor1Id = competitorsIds[i];
                const competitor2Id = competitorsIds[competitorsCount - i - 1];

                if (competitor1Id == dummyId || competitor2Id == dummyId) {
                    continue;
                }

                const match = new Match(i, competition.id, competitor1Id, competitor2Id, round + 1, null, null);
                roundMatches.push(match);
            }

            matches.push(...roundMatches);

            // rotate competitors so that each competitor plays with a different competitor
            competitorsIds.splice(1, 0, competitorsIds.pop()!);
        }

        // Add matches to the competition
        for (const match of matches) {
            await prisma.matches.create({
                data: {
                    competitionId: match.competitionId,
                    competitor1Id: match.competitor1Id,
                    competitor2Id: match.competitor2Id,
                    round: match.round,
                }
            });
        }
        
        res.redirect('/');
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: error.message || error });
    }
});

app.get('/competitions/:id', async (req, res) => {
    try {
        const competitionId = parseInt(req.params.id);
        const competition = await prisma.competitions.findUnique({
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
        });

        if (competition == null) {
            res.status(404).send('Competition not found');
            return;
        }

        const competitors: Competitor[] = competition.competitors
                                                        .map((competitor: Competitor) => {
                                                            competitor.totalPoints = competitor.wins * competition.winPoints
                                                                + competitor.draws * competition.drawPoints
                                                                + competitor.losses * competition.lossPoints;
                                                            return competitor;
                                                        })
                                                        .sort((a: Competitor, b: Competitor) => b.totalPoints - a.totalPoints);
        const matches: Match[] = competition.matches;

        // Group matches by round
        const matchesByRound: Round[] = [];
        for (let match of matches) {
            if (matchesByRound[match.round - 1] == null) {
                matchesByRound[match.round - 1] = new Round(match.round, []);
            }

            // add competitors to matches
            match.competitor1 = competitors.find((competitor: Competitor) => competitor.id == match.competitor1Id);
            match.competitor2 = competitors.find((competitor: Competitor) => competitor.id == match.competitor2Id);

            matchesByRound[match.round - 1].matches.push(match);
        }

        // sort matches by round
        matchesByRound.sort((a: Round, b: Round) => a.roundNumber - b.roundNumber);

        res.render('competition', { user: req.oidc.user, competition, competitors, matchesByRound });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: error.message || error });
    }
});

app.post('/matches/:matchId', requiresAuth(), middleware.validateMatchData, async (req, res) => {
    try {
        const matchId = parseInt(req.params.matchId);
        const score1 = parseInt(req.body.score1);
        const score2 = parseInt(req.body.score2);

        const match = await prisma.matches.findUnique({
            where: {
                id: matchId,
            }
        });

        console.log(`match: ${JSON.stringify(match)}`);

        if (match == null || match == undefined) {
            res.status(404).send('Match not found');
            return;
        }

        await prisma.matches.update({
            where: {
                id: matchId,
            },
            data: {
                score1: score1,
                score2: score2,
            }
        });

        res.redirect(`/competitions/${match.competitionId}`);
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: error.message || error });
    }
});

app.get("/signup", (req, res) => {
    res.oidc.login({
        returnTo: '/',
        authorizationParams: {      
        screen_hint: "signup",
        },
    });
});

app.listen(port, () => {
    console.log(`Listening at http://${host}:${port}`);
});