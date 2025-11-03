-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "reminderEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminderHour" INTEGER,
ADD COLUMN     "reminderTimezone" TEXT NOT NULL DEFAULT 'Europe/Berlin';
