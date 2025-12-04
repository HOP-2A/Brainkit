/*
  Warnings:

  - You are about to drop the column `password` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the `CreateQuizSet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clerkId` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreateQuizSet" DROP CONSTRAINT "CreateQuizSet_creatorId_fkey";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "password",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- DropTable
DROP TABLE "CreateQuizSet";
