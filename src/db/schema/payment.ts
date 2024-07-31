import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    date,
    double,
    decimal,
    datetime,
    serial,
} from "drizzle-orm/mysql-core";
import { InferSelectModel, InferInsertModel, eq, sql } from "drizzle-orm";
import db from "../../db";
import { order } from "./order";

export const payment = mysqlTable("payment", {
    paymentId: serial("payment_id").primaryKey(),
    orderId: int("order_id")
        .notNull()
        .references(() => order.orderId),
    paymentMethod: varchar("payment_method", { length: 40 }).notNull(),
    paymentTime: datetime("payment_time")
        .notNull()
        .default(sql`current_timestamp()`),
    amount: decimal("amount", { scale: 10, precision: 2 }).notNull(),
    status: varchar("status", { length: 40 }).notNull(),
});

export type Payment = InferSelectModel<typeof payment>;
export type NewPayment = InferInsertModel<typeof payment>;
