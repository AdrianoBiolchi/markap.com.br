/*
  Warnings:

  - You are about to drop the column `employeesCost` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyRent` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `otherFixedCosts` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `ownerSalary` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `utilitiesCost` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "employeesCost",
DROP COLUMN "monthlyRent",
DROP COLUMN "otherFixedCosts",
DROP COLUMN "ownerSalary",
DROP COLUMN "utilitiesCost";
