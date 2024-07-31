import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    datetime,
    serial,
} from "drizzle-orm/mysql-core";
import { InferSelectModel, InferInsertModel, eq, sql } from "drizzle-orm";
import db from "../../db";
import { customer } from "./customer";
import { table } from "./table";

export const reservations = mysqlTable("reservations", {
    reservationId: serial("reservation_id").primaryKey(),
    customerId: int("customer_id")
        .notNull()
        .references(() => customer.customerId),
    tableId: int("table_id")
        .notNull()
        .references(() => table.tableId),
    reservationDate: datetime("reservation_datetime")
        .notNull()
        .default(sql.raw("NOW()")),
    numberOfGuests: int("number_of_guests").notNull().default(1),
    specialRequests: varchar("special_requests", { length: 255 }),
});

export type Reservation = InferSelectModel<typeof reservations>;
export type NewReservation = InferInsertModel<typeof reservations>;

const selectResevationByCustomerId = db
    .select()
    .from(reservations)
    .where(eq(reservations.customerId, sql.placeholder("id")));

const deleteReservationByCustomerId = db
    .delete(reservations)
    .where(eq(reservations.customerId, sql.placeholder("id")));

export const getReservationsByCustomerId = async (id: number) =>
    await selectResevationByCustomerId.execute({ id });

export const deleteReservationsByCustomerId = async (id: number) =>
    await deleteReservationByCustomerId.execute({ id });

export const updateReservationsByCustomerId = async (
    id: number,
    reservation: NewReservation,
) =>
    await db
        .update(reservations)
        .set(reservation)
        .where(eq(reservations.customerId, id));

export const insertReservation = async (reservation: NewReservation) =>
    await db.insert(reservations).values(reservation);
