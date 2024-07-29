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
