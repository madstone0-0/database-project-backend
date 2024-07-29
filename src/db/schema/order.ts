import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    date,
    double,
    serial,
} from "drizzle-orm/mysql-core";
import { InferSelectModel, InferInsertModel, eq, sql } from "drizzle-orm";
import db from "../../db";
import { customer } from "./customer";
import { staff } from "./staff";

export const order = mysqlTable("order", {
    orderId: serial("order_id").primaryKey(),
    customerId: int("customer_id")
        .notNull()
        .references(() => customer.customerId),
    staffId: int("staff_id").references(() => staff.staffId),
    orderTime: date("order_time")
        .notNull()
        .default(sql`CURRENT_TIME`),
    totalAmount: double("total_amount", { scale: 10, precision: 2 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("Pending"),
});

export type Order = InferSelectModel<typeof order>;
export type NewOrder = InferInsertModel<typeof order>;
