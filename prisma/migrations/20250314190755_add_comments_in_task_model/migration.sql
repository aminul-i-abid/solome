-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "comments" TEXT[] DEFAULT ARRAY[]::TEXT[];
