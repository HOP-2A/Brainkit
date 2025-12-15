/*
  Warnings:

  - Added the required column `timer` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "timer" INTEGER NOT NULL;
