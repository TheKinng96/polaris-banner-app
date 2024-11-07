/*
  Warnings:

  - You are about to drop the column `source` on the `Banner` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Metafield" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Banner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discountId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "customThemeId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Banner_customThemeId_fkey" FOREIGN KEY ("customThemeId") REFERENCES "Theme" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Banner" ("createdAt", "customThemeId", "discountId", "id", "status", "text", "theme", "title", "updatedAt") SELECT "createdAt", "customThemeId", "discountId", "id", "status", "text", "theme", "title", "updatedAt" FROM "Banner";
DROP TABLE "Banner";
ALTER TABLE "new_Banner" RENAME TO "Banner";
CREATE UNIQUE INDEX "Banner_discountId_key" ON "Banner"("discountId");
CREATE UNIQUE INDEX "Banner_customThemeId_key" ON "Banner"("customThemeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
