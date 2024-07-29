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

export const supplier = mysqlTable("supplier", {
    supplierId: serial("supplier_id").primaryKey(),
    name: varchar("name", { length: 40 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 40 }).notNull(),
    email: varchar("email", { length: 40 }).notNull(),
    address: varchar("address", { length: 40 }).notNull(),
});

export type Supplier = InferSelectModel<typeof supplier>;
export type NewSupplier = InferInsertModel<typeof supplier>;
