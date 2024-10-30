/*
  Warnings:

  - Added the required column `discountId` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Banner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discountId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "customThemeId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Banner_customThemeId_fkey" FOREIGN KEY ("customThemeId") REFERENCES "Theme" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Banner" ("createdAt", "customThemeId", "id", "source", "text", "theme", "updatedAt") SELECT "createdAt", "customThemeId", "id", "source", "text", "theme", "updatedAt" FROM "Banner";
DROP TABLE "Banner";
ALTER TABLE "new_Banner" RENAME TO "Banner";
CREATE UNIQUE INDEX "Banner_customThemeId_key" ON "Banner"("customThemeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
