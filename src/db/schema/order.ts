import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    date,
    double,
    decimal,
    serial,
} from "drizzle-orm/mysql-core";
import { InferSelectModel, InferInsertModel, eq, sql, desc } from "drizzle-orm";
import db from "../../db";
import { customer } from "./customer";
import { staff } from "./staff";
import { insertOrderDetails, orderDetails } from "./orderDetails";
import { MenuItem, menuItem } from "./menuItem";
import { getMenuInventoryItemByMenuItemId } from "./menuItemInventory";
import { getInventoryById, updateInventoryById } from "./inventory";

export const order = mysqlTable("order", {
    orderId: serial("order_id").primaryKey(),
    customerId: int("customer_id")
        .notNull()
        .references(() => customer.customerId),
    staffId: int("staff_id").references(() => staff.staffId),
    orderTime: date("order_time")
        .notNull()
        .default(sql`CURRENT_TIME`),
    totalAmount: decimal("total_amount", { scale: 10, precision: 2 }),
    status: varchar("status", { length: 20 }).notNull().default("Pending"),
});

export type Order = InferSelectModel<typeof order>;
export type NewOrder = InferInsertModel<typeof order>;

const allOrders = db.select().from(order).orderBy(order.orderId);

const allOrdersWithDetails = db
    .select({
        orderId: order.orderId,
        customerId: order.customerId,
        staffId: order.staffId,
        orderTime: order.orderTime,
        totalAmount: order.totalAmount,
        status: order.status,
        orderDetails: {
            menuItemId: orderDetails.menuItemId,
            quantity: orderDetails.quantity,
        },
        menuItem: {
            name: menuItem.name,
            price: menuItem.price,
        },
    })
    .from(order)
    .innerJoin(orderDetails, eq(order.orderId, orderDetails.orderId))
    .innerJoin(menuItem, eq(orderDetails.menuItemId, menuItem.menuItemId))
    .orderBy(order.orderId);

const selectOrderByOrderId = db
    .select()
    .from(order)
    .where(eq(order.orderId, sql.placeholder("id")));

const selectOrderByCustomerId = db
    .select({
        orderId: order.orderId,
        customerId: order.customerId,
        orderTime: order.orderTime,
        totalAmount: order.totalAmount,
        status: order.status,
        orderDetails: {
            menuItemId: orderDetails.menuItemId,
            quantity: orderDetails.quantity,
        },
        menuItem: {
            name: menuItem.name,
            price: menuItem.price,
        },
    })
    .from(order)
    .innerJoin(orderDetails, eq(order.orderId, orderDetails.orderId))
    .innerJoin(menuItem, eq(orderDetails.menuItemId, menuItem.menuItemId))
    .where(eq(order.customerId, sql.placeholder("id")))
    .orderBy(desc(order.orderTime));

const selectOrderByStaffId = db
    .select()
    .from(order)
    .where(eq(order.staffId, sql.placeholder("id")));

const deleteOrderByOrderId = db
    .delete(order)
    .where(eq(order.orderId, sql.placeholder("id")));

export const getAllOrderWithDetails = async () =>
    allOrdersWithDetails.execute();

export const getCustomerOrders = async (customerId: number) =>
    selectOrderByCustomerId.execute({ id: customerId });

export const insertOrder = async (newOrder: NewOrder) =>
    await db.insert(order).values(newOrder);

export const updateOrder = async (id: number, newOrder: NewOrder) =>
    await db.update(order).set(newOrder).where(eq(order.orderId, id));

export const deleteOrder = async (id: number) =>
    await deleteOrderByOrderId.execute({ id });
