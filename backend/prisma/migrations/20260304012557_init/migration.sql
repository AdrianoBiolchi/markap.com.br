-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'BUSINESS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "businessType" TEXT,
    "taxRegime" TEXT,
    "onboarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "productionCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "laborCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "packagingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyRent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownerSalary" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "employeesCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "utilitiesCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherFixedCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedVolume" INTEGER NOT NULL DEFAULT 100,
    "cardFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketplaceFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "desiredMargin" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "maxDiscount" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "competitorPrice" DOUBLE PRECISION,
    "suggestedPrice" DOUBLE PRECISION,
    "currentPrice" DOUBLE PRECISION,
    "netMargin" DOUBLE PRECISION,
    "breakEven" INTEGER,
    "healthScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
