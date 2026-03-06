-- AlterTable
ALTER TABLE "BusinessProfile" ADD COLUMN     "monthlyProfitGoal" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "monthlyRevenueGoal" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "segment" TEXT DEFAULT 'outro';
