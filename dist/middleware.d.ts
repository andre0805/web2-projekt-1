import { Request, Response, NextFunction } from 'express';
declare const validateCompetitionData: (req: Request, res: Response, next: NextFunction) => void;
declare const validateMatchData: (req: Request, res: Response, next: NextFunction) => void;
export { validateCompetitionData, validateMatchData };
