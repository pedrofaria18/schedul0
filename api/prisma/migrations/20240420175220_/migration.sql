-- AlterTable
ALTER TABLE "services" ADD COLUMN     "canceledAppointmentId" UUID;

-- CreateTable
CREATE TABLE "canceled_appointments" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "status" "appointment_status" NOT NULL DEFAULT 'SCHEDULED',
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "canceled_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CanceledAppointmentToCollaborator" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CanceledAppointmentToCollaborator_AB_unique" ON "_CanceledAppointmentToCollaborator"("A", "B");

-- CreateIndex
CREATE INDEX "_CanceledAppointmentToCollaborator_B_index" ON "_CanceledAppointmentToCollaborator"("B");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_canceledAppointmentId_fkey" FOREIGN KEY ("canceledAppointmentId") REFERENCES "canceled_appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canceled_appointments" ADD CONSTRAINT "canceled_appointments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canceled_appointments" ADD CONSTRAINT "canceled_appointments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CanceledAppointmentToCollaborator" ADD CONSTRAINT "_CanceledAppointmentToCollaborator_A_fkey" FOREIGN KEY ("A") REFERENCES "canceled_appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CanceledAppointmentToCollaborator" ADD CONSTRAINT "_CanceledAppointmentToCollaborator_B_fkey" FOREIGN KEY ("B") REFERENCES "collaborators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
