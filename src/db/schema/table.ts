import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    serial,
} from "drizzle-orm/mysql-core";
import { InferSelectModel, InferInsertModel, eq, sql } from "drizzle-orm";
import db from "../../db";

export const table = mysqlTable("table", {
    tableId: serial("table_id").primaryKey(),
    tableNumber: int("table_number").notNull(),
    seatingCapacity: int("seating_capacity").notNull(),
    location: varchar("location", { length: 40 }),
});

export type Table = InferSelectModel<typeof table>;
export type NewTable = InferInsertModel<typeof table>;
