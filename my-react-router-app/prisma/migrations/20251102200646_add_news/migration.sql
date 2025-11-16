-- CreateEnum
CREATE TYPE "public"."PraxisStatus" AS ENUM ('DUE', 'SUBMITTED', 'APPROVED', 'KLAUSUR', 'DRAFT', 'KLAUSURPHASE');

-- CreateEnum
CREATE TYPE "public"."NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "courseId" INTEGER,
ADD COLUMN     "fileType" TEXT,
ADD COLUMN     "lastOpenedAt" TIMESTAMP(3),
ADD COLUMN     "size" TEXT,
ADD COLUMN     "studiengangId" INTEGER;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "studiengangId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Studiengang" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Studiengang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Course" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "studiengangId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileReadingState" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "lastPage" INTEGER,
    "totalPages" INTEGER,
    "scrollPosition" DOUBLE PRECISION,
    "bookmarks" TEXT,
    "annotations" TEXT,
    "readingProgress" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileReadingState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PraxisReport" (
    "id" SERIAL NOT NULL,
    "isoWeekKey" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "days" JSONB NOT NULL,
    "tasks" TEXT NOT NULL,
    "grade" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."PraxisStatus" NOT NULL DEFAULT 'DUE',
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PraxisReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."News" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT,
    "author" TEXT,
    "coverImageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."NewsStatus" NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Studiengang_name_key" ON "public"."Studiengang"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FileReadingState_fileId_key" ON "public"."FileReadingState"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "PraxisReport_isoWeekKey_userId_key" ON "public"."PraxisReport"("isoWeekKey", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "public"."News"("slug");

-- CreateIndex
CREATE INDEX "News_publishedAt_featured_idx" ON "public"."News"("publishedAt", "featured");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_studiengangId_fkey" FOREIGN KEY ("studiengangId") REFERENCES "public"."Studiengang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_studiengangId_fkey" FOREIGN KEY ("studiengangId") REFERENCES "public"."Studiengang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_studiengangId_fkey" FOREIGN KEY ("studiengangId") REFERENCES "public"."Studiengang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileReadingState" ADD CONSTRAINT "FileReadingState_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PraxisReport" ADD CONSTRAINT "PraxisReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
