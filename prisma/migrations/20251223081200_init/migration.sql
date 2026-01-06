/*
  Warnings:

  - You are about to drop the `StudentAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentQuizAttempt` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEACHER', 'STUDENT');

-- DropForeignKey
ALTER TABLE "StudentAnswer" DROP CONSTRAINT "StudentAnswer_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "StudentAnswer" DROP CONSTRAINT "StudentAnswer_optionId_fkey";

-- DropForeignKey
ALTER TABLE "StudentAnswer" DROP CONSTRAINT "StudentAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "StudentQuizAttempt" DROP CONSTRAINT "StudentQuizAttempt_quizId_fkey";

-- DropForeignKey
ALTER TABLE "StudentQuizAttempt" DROP CONSTRAINT "StudentQuizAttempt_studentId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT';

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'TEACHER';

-- DropTable
DROP TABLE "StudentAnswer";

-- DropTable
DROP TABLE "StudentQuizAttempt";

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userRole" "Role" NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "QuizOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
