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
import { order } from "./order";

export const feedback = mysqlTable("feedback", {
    feedbackId: serial("feedback_id").primaryKey(),
    customerId: int("customer_id")
        .notNull()
        .references(() => customer.customerId),
    orderId: int("order_id")
        .notNull()
        .references(() => order.orderId),
    rating: int("rating").notNull(),
    comments: varchar("comments", { length: 255 }),
    feedbackDate: date("feedback_date")
        .notNull()
        .default(sql`current_date`),
});

export type Feedback = InferSelectModel<typeof feedback>;
export type NewFeedback = InferInsertModel<typeof feedback>;
