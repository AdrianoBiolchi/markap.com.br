-- CreateEnum
CREATE TYPE "PricingMode" AS ENUM ('SIMPLE', 'ADVANCED');

-- CreateTable
CREATE TABLE "BusinessProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthlyRent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownerSalary" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "employeesCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "utilitiesCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accountingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "systemsCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherFixedCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedMonthlyRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pricingMode" "PricingMode" NOT NULL DEFAULT 'SIMPLE',
    "fixedCostPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_userId_key" ON "BusinessProfile"("userId");

-- AddForeignKey
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
