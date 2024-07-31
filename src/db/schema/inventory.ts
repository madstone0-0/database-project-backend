import { InferInsertModel, InferSelectModel, eq, lt, sql } from "drizzle-orm";
import {
    date,
    double,
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
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

const allInventory = db.select().from(inventory).orderBy(inventory.inventoryId);

const inventorySelectById = db
    .select()
    .from(inventory)
    .where(eq(inventory.inventoryId, sql.placeholder("id")));

const inventoryDeleteById = db
    .delete(inventory)
    .where(eq(inventory.inventoryId, sql.placeholder("id")));

const inventoryAllToBeRestocked = db.select({
    supplierId: supplier.supplierId,
    supplierName: supplier.name,
    supplierPhoneNumber: supplier.phoneNumber,
    supplierEmail: supplier.email,
    itemId: inventory.inventoryId,
    itemName: inventory.itemName,
}).from(supplier).innerJoin(inventory, eq(supplier.supplierId, inventory.supplierId)).where(
    lt(inventory.quantity, inventory.reorderLevel)
)

export const getAllInventory = async () => allInventory.execute();

export const getInventoryById = async (id: number) =>
    inventorySelectById.execute({ id });

export const insertInventory = async (newInventory: NewInventory) =>
    db.insert(inventory).values(newInventory);

export const updateInventoryById = async (
    id: number,
    newInventory: NewInventory,
) => db.update(inventory).set(newInventory).where(eq(inventory.inventoryId, id));

export const deleteInventoryById = async (id: number) =>
    inventoryDeleteById.execute({ id });

export const getAllToBeRestocked = async () => inventoryAllToBeRestocked.execute();