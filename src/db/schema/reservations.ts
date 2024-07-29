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
