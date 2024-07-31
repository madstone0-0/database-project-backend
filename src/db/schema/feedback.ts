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
import { InferSelectModel, InferInsertModel, eq, sql, sum } from "drizzle-orm";
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

export const feedbackByCustomers = async () =>
    await db
        .select({
            customerId: customer.customerId,
            firstName: customer.firstName,
            lastName: customer.lastName,
            totalSpent: sum(order.totalAmount),
            feedback: {
                orderId: feedback.orderId,
                rating: feedback.rating,
                comments: feedback.comments,
                feedbackDate: feedback.feedbackDate,
            },
        })
        .from(customer)
        .innerJoin(order, eq(customer.customerId, order.customerId))
        .innerJoin(feedback, eq(order.orderId, feedback.orderId))
        .groupBy(customer.customerId, customer.firstName, customer.lastName);
