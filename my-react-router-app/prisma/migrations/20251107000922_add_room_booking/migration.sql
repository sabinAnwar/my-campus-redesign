-- CreateTable
CREATE TABLE "public"."RoomBooking" (
    "id" SERIAL NOT NULL,
    "roomId" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "campus" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomBooking_date_campus_roomId_idx" ON "public"."RoomBooking"("date", "campus", "roomId");

-- CreateIndex
CREATE INDEX "RoomBooking_userId_date_idx" ON "public"."RoomBooking"("userId", "date");

-- AddForeignKey
ALTER TABLE "public"."RoomBooking" ADD CONSTRAINT "RoomBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
