-- CreateTable
CREATE TABLE "ContactPeople" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "includeInEmails" BOOLEAN DEFAULT false,
    "contactId" TEXT,

    CONSTRAINT "ContactPeople_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "companyRegNumber" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContactPeople" ADD CONSTRAINT "ContactPeople_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
