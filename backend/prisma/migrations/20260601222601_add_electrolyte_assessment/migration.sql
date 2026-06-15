-- CreateTable
CREATE TABLE "ElectrolyteAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "athleteId" TEXT NOT NULL,
    "sweatMarksScore" INTEGER NOT NULL,
    "crampScore" INTEGER NOT NULL,
    "saltyScore" INTEGER NOT NULL,
    "concentration" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ElectrolyteAssessment_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
