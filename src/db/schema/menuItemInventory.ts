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
    },
    (t) => {
        return {
            pk: primaryKey({ columns: [t.menuItemId, t.inventoryId] }),
        };
    },
);

export type MenuItemInventory = InferSelectModel<typeof menuItemInventory>;
export type NewMenuItemInventory = InferInsertModel<typeof menuItemInventory>;
