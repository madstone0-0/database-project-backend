import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    date,
    double,
    serial,
    primaryKey,
} from "drizzle-orm/mysql-core";
import { InferSelectModel, InferInsertModel, eq, sql } from "drizzle-orm";
import db from "../../db";
import { menuItem } from "./menuItem";
import { inventory } from "./inventory";

export const menuItemInventory = mysqlTable(
    "menu_item_inventory",
    {
        menuItemId: int("menu_item_id")
            .notNull()
            .references(() => menuItem.menuItemId),
        inventoryId: int("inventory_id")
            .notNull()
            .references(() => inventory.inventoryId),
        quantityUsed: int("quantity_used").notNull(),
    },
    (t) => {
        return {
            pk: primaryKey({ columns: [t.menuItemId, t.inventoryId] }),
        };
    },
);

export type MenuItemInventory = InferSelectModel<typeof menuItemInventory>;
export type NewMenuItemInventory = InferInsertModel<typeof menuItemInventory>;

const menuInventoryItemByMenuItemId = db
    .select()
    .from(menuItemInventory)
    .where(eq(menuItem.menuItemId, sql.placeholder("id")));

export const getMenuInventoryItemByMenuItemId = async (id: number) =>
    menuInventoryItemByMenuItemId.execute({ id });

export const insertMenuItemInventory = async (
    newMenuItemInventory: NewMenuItemInventory,
) => db.insert(menuItemInventory).values(newMenuItemInventory);

export const deleteMenuItemInventory = async (id: number) =>
    db.delete(menuItemInventory).where(eq(menuItem.menuItemId, id));

export const updateMenuItemInventory = async (
    id: number,
    newMenuItemInventory: NewMenuItemInventory,
) =>
    db
        .update(menuItemInventory)
        .set(newMenuItemInventory)
        .where(eq(menuItem.menuItemId, id));
