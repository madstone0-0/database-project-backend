import {
    NewReservation,
    deleteReservationsByCustomerId,
    getReservationsByCustomerId,
    insertReservation,
    updateReservationsByCustomerId,
} from "../db/schema/reservations";
import { ServiceReturn } from "../types";
import { OK } from "../utils";
import { handleServerError } from "../utils/handleErrors";

class ReservationService {
    async GetCustomerReservation(id: number): Promise<ServiceReturn> {
        try {
            const reservation = await getReservationsByCustomerId(id);
            return OK({ reservation });
        } catch (err) {
            return handleServerError(
                err,
                "Error fetching customer reservation",
            );
        }
    }

    async Add(reservation: NewReservation): Promise<ServiceReturn> {
        try {
            const currRes = await getReservationsByCustomerId(
                reservation.customerId,
            );

            if (currRes.length > 0) {
                return {
                    status: 400,
                    data: {
                        message: "Customer already has a reservation",
                    },
                };
            }

            const res = await insertReservation(reservation);
            return OK({ message: "Added reservation successfully" });
        } catch (err) {
            return handleServerError(err, "Error adding reservation");
        }
    }

    async Update(
        reservation: NewReservation,
        reservationId: number,
    ): Promise<ServiceReturn> {
        try {
            const res = await updateReservationsByCustomerId(
                reservationId,
                reservation,
            );
            return OK({ message: "Updated reservation successfully" });
        } catch (err) {
            return handleServerError(err, "Error updating reservation");
        }
    }

    async Delete(reservationId: number): Promise<ServiceReturn> {
        try {
            const res = await deleteReservationsByCustomerId(reservationId);
            return OK({ message: "Deleted reservation successfully" });
        } catch (err) {
            return handleServerError(err, "Error deleting reservation");
        }
    }
}
