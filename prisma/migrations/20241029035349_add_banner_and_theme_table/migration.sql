-- CreateTable
CREATE TABLE "Banner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "customThemeId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Banner_customThemeId_fkey" FOREIGN KEY ("customThemeId") REFERENCES "Theme" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "background" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Banner_customThemeId_key" ON "Banner"("customThemeId");
