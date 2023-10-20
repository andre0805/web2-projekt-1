-- CreateTable
CREATE TABLE "competitions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "creatorUserId" VARCHAR(255) NOT NULL,
    "winPoints" DOUBLE PRECISION NOT NULL,
    "drawPoints" DOUBLE PRECISION NOT NULL,
    "lossPoints" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitors" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "competitor1Id" INTEGER NOT NULL,
    "competitor2Id" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "score1" INTEGER,
    "score2" INTEGER,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_competition_competitor1_round" ON "matches"("competitionId", "competitor1Id", "round");

-- CreateIndex
CREATE UNIQUE INDEX "unique_competition_competitor2_round" ON "matches"("competitionId", "competitor2Id", "round");

-- AddForeignKey
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_competition_id_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_competition_id_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_competitor_1_id_fkey" FOREIGN KEY ("competitor1Id") REFERENCES "competitors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_competitor_2_id_fkey" FOREIGN KEY ("competitor2Id") REFERENCES "competitors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

