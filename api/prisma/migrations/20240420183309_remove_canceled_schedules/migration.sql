/*
  Warnings:

  - You are about to drop the `_CanceledAppointmentToCollaborator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `canceled_appointments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CanceledAppointmentToCollaborator" DROP CONSTRAINT "_CanceledAppointmentToCollaborator_A_fkey";

-- DropForeignKey
ALTER TABLE "_CanceledAppointmentToCollaborator" DROP CONSTRAINT "_CanceledAppointmentToCollaborator_B_fkey";

-- DropForeignKey
ALTER TABLE "canceled_appointments" DROP CONSTRAINT "canceled_appointments_client_id_fkey";

-- DropForeignKey
ALTER TABLE "canceled_appointments" DROP CONSTRAINT "canceled_appointments_company_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_canceledAppointmentId_fkey";

-- DropTable
DROP TABLE "_CanceledAppointmentToCollaborator";

-- DropTable
DROP TABLE "canceled_appointments";
