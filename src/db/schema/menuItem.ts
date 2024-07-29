import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    date,
    double,
    boolean,
    serial,
} from "drizzle-orm/mysql-core";
import { InferSelectModel, InferInsertModel, eq, sql } from "drizzle-orm";
import db from "../../db";

export const menuItem = mysqlTable("menu_item", {
    menuItemId: serial("menu_item_id").primaryKey(),
    name: varchar("name", { length: 40 }).notNull(),
    description: varchar("description", { length: 40 }).notNull(),
    price: double("price", { scale: 10, precision: 2 }).notNull(),
    category: varchar("category", { length: 40 }),
    availabilityStatus: boolean("availability_status"),
});

export type MenuItem = InferSelectModel<typeof menuItem>;
export type NewMenuItem = InferInsertModel<typeof menuItem>;
