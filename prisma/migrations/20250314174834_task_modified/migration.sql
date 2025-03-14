/*
  Warnings:

  - You are about to drop the column `status` on the `SubTask` table. All the data in the column will be lost.
  - You are about to drop the column `end` on the `TimeLog` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `TimeLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubTask" DROP COLUMN "status",
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TimeLog" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3);
