import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    serial,
} from "drizzle-orm/mysql-core";
import {
    InferSelectModel,
    InferInsertModel,
    eq,
    sql,
    notInArray,
} from "drizzle-orm";
import db from "../../db";
import { reservations } from "./reservations";

export const table = mysqlTable("table", {
    tableId: serial("table_id").primaryKey(),
    tableNumber: int("table_number").notNull(),
    seatingCapacity: int("seating_capacity").notNull(),
    location: varchar("location", { length: 40 }),
});

export type Table = InferSelectModel<typeof table>;
export type NewTable = InferInsertModel<typeof table>;

const allTables = db.select().from(table).orderBy(table.tableId);

const selectTableByTableId = db
    .select()
    .from(table)
    .where(eq(table.tableId, sql.placeholder("id")));

export const getAllTables = async () => await allTables.execute();

export const getTableByTableId = async (id: number) =>
    await selectTableByTableId.execute({ id });

export const getAllUnreservedTables = async () => {
    let tableIds = db
        .select({ tableId: reservations.tableId })
        .from(reservations)
        .as("tableIds");
    return await db
        .select()
        .from(table)
        .where(notInArray(table.tableId, tableIds))
        .execute();
};
