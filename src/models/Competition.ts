class Competition {
    id: number;
    name: string;
    creatorUserId: string;
    winPoints: number;
    drawPoints: number;
    lossPoints: number;

    constructor(id: number, name: string, creatorUserId: string, winPoints: number, drawPoints: number, lossPoints: number) {
        this.id = id;
        this.name = name;
        this.creatorUserId = creatorUserId;
        this.winPoints = winPoints;
        this.drawPoints = drawPoints;
        this.lossPoints = lossPoints;
    }
}

export { Competition }
