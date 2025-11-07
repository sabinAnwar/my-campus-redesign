/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "matriculationNumber" TEXT,
ADD COLUMN     "studyProgram" TEXT,
ADD COLUMN     "validUntil" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "public"."Course"("code");
