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
import { order } from "./order";
import { menuItem } from "./menuItem";

export const orderDetails = mysqlTable("order_details", {
    orderDetailId: serial("order_detail_id").primaryKey(),
    orderId: int("order_id")
        .notNull()
        .references(() => order.orderId),
    menuItemId: int("menu_item_id")
        .notNull()
        .references(() => menuItem.menuItemId),
    quantity: int("quantity").notNull(),
});

export type OrderDetails = InferSelectModel<typeof orderDetails>;
export type NewOrderDetails = InferInsertModel<typeof orderDetails>;

export const getOrderDetailsByOrderId = async (id: number) =>
    await db
        .select()
        .from(orderDetails)
        .where(eq(orderDetails.orderId, id))
        .execute();

export const insertOrderDetails = async (newOrderDetails: NewOrderDetails) =>
    await db.insert(orderDetails).values(newOrderDetails);

export const deleteOrderDetails = async (id: number) =>
    await db.delete(orderDetails).where(eq(orderDetails.orderId, id));

export const updateOrderDetails = async (
    id: number,
    newOrderDetails: NewOrderDetails,
) =>
    await db
        .update(orderDetails)
        .set(newOrderDetails)
        .where(eq(orderDetails.orderId, id));
