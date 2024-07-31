import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    date,
    double,
    boolean,
    decimal,
    serial,
} from "drizzle-orm/mysql-core";
import {
    InferSelectModel,
    InferInsertModel,
    eq,
    sum,
    sql,
    desc,
} from "drizzle-orm";
import db from "../../db";
import { orderDetails } from "./orderDetails";
import order from "../../routes/user/order";

export const menuItem = mysqlTable("menu_item", {
    menuItemId: serial("menu_item_id").primaryKey(),
    name: varchar("name", { length: 40 }).notNull(),
    description: varchar("description", { length: 40 }).notNull(),
    price: decimal("price", { scale: 10, precision: 2 }).notNull(),
    category: varchar("category", { length: 40 }),
    availabilityStatus: boolean("availability_status"),
});

export type MenuItem = InferSelectModel<typeof menuItem>;
export type NewMenuItem = InferInsertModel<typeof menuItem>;

const allMenuItems = db.select().from(menuItem).orderBy(menuItem.menuItemId);

export const getAllMenuItems = async () => await allMenuItems.execute();

export const getMostOrderedItems = async () =>
    db
        .select({
            name: menuItem.name,
            totalQuantity: sum(orderDetails.quantity),
        })
        .from(menuItem)
        .innerJoin(
            orderDetails,
            eq(menuItem.menuItemId, orderDetails.menuItemId),
        )
        .groupBy(menuItem.name)
        .orderBy(desc(sum(orderDetails.quantity)));
