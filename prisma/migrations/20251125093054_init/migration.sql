-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classRoomId_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "classRoomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classRoomId_fkey" FOREIGN KEY ("classRoomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
