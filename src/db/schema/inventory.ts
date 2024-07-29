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
import { supplier } from "./supplier";

export const inventory = mysqlTable("inventory", {
    inventoryId: serial("inventory_id").primaryKey(),
    itemName: varchar("item_name", { length: 40 }).notNull(),
    quantity: int("quantity").notNull(),
    unit: int("unit").notNull(),
    reorderLevel: int("reorder_level").notNull(),
    supplierId: int("supplier_id")
        .notNull()
        .references(() => supplier.supplierId),
});

export type Inventory = InferSelectModel<typeof inventory>;
export type NewInventory = InferInsertModel<typeof inventory>;
