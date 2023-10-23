import express, { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client';
import path from 'path';

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const prisma = new PrismaClient();

const validateCompetitionData = (req: Request, res: Response, next: NextFunction) => {
    const competitionName = req.body.competitionName;        
    const competitors = req.body.competitors.replaceAll(';', '\n').split('\n').filter((x: string) => x.trim().length > 0)
    const scoringSystem: number[] = req.body.scoringSystem.replaceAll(',', '.').split('/').map((x: string) => parseFloat(x));
    const winPoints: number = scoringSystem[0];
    const drawPoints: number = scoringSystem[1];
    const lossPoints: number = scoringSystem[2];
        

    if (competitionName.length == 0) {
        res.render('index', { user: req.oidc.user, error: 'Invalid competition name' });;
        return;
    }

    if (competitors.length < 4 || competitors.length > 8) {
        res.render('index', { user: req.oidc.user, error: 'Invalid number of competitors' });
        return;
    }

    if (
        typeof winPoints !== 'number' || typeof drawPoints !== 'number' || typeof lossPoints !== 'number' ||
        typeof winPoints === 'undefined' || typeof drawPoints === 'undefined' || typeof lossPoints === 'undefined' ||
        isNaN(winPoints) || isNaN(drawPoints) || isNaN(lossPoints)
    ) {
        res.render('index', { user: req.oidc.user, error: 'Invalid scoring system' });
        return;
    }

    next();
}

const validateMatchData = async (req: Request, res: Response, next: NextFunction) => {
    const matchId = parseInt(req.params.matchId);
    
    const match = await prisma.matches.findUnique({
        where: {
            id: matchId
        }
    });

    if (match === null) {
        res.status(404).send('Match not found');
        return;
    }

    const score1 = parseInt(req.body.score1);
    const score2 = parseInt(req.body.score2);

    if (isNaN(score1) && !isNaN(score2) || !isNaN(score1) && isNaN(score2)) {
        res.status(400).send('Invalid score');
        return;
    }

    next();
}

export { validateCompetitionData, validateMatchData }