declare class Competition {
    id: number;
    name: string;
    creatorUserId: string;
    winPoints: number;
    drawPoints: number;
    lossPoints: number;
    constructor(id: number, name: string, creatorUserId: string, winPoints: number, drawPoints: number, lossPoints: number);
}
export { Competition };
