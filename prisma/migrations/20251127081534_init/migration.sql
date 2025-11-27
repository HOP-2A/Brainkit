/*
  Warnings:

  - Added the required column `title` to the `Classroom` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `CreateQuizSet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "coverImg" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CreateQuizSet" ALTER COLUMN "title" SET NOT NULL;
