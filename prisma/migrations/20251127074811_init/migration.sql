-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "coverImg" TEXT,
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "CreateQuizSet" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "coverImg" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreateQuizSet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreateQuizSet" ADD CONSTRAINT "CreateQuizSet_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
