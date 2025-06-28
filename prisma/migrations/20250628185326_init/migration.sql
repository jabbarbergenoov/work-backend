-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleOnSlugdata" (
    "slugdataId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "ModuleOnSlugdata_pkey" PRIMARY KEY ("slugdataId","moduleId")
);

-- AddForeignKey
ALTER TABLE "ModuleOnSlugdata" ADD CONSTRAINT "ModuleOnSlugdata_slugdataId_fkey" FOREIGN KEY ("slugdataId") REFERENCES "Slugdata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleOnSlugdata" ADD CONSTRAINT "ModuleOnSlugdata_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
