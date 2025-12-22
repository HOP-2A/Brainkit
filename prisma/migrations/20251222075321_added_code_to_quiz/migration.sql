/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_code_key" ON "Quiz"("code");
