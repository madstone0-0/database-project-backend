import { InferInsertModel, InferSelectModel, eq, sql } from "drizzle-orm";
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

export const supplier = mysqlTable("supplier", {
    supplierId: serial("supplier_id").primaryKey(),
    name: varchar("name", { length: 40 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 40 }).notNull(),
    email: varchar("email", { length: 40 }).notNull(),
    address: varchar("address", { length: 40 }).notNull(),
});

export type Supplier = InferSelectModel<typeof supplier>;
export type NewSupplier = InferInsertModel<typeof supplier>;


const allSuppliers = db.select().from(supplier).orderBy(supplier.supplierId)

const supplierSelectById = db
    .select()
    .from(supplier)
    .where(eq(supplier.supplierId, sql.placeholder("id")));

const supplierDeleteById = db
    .delete(supplier)
    .where(eq(supplier.supplierId, sql.placeholder("id")));

export const getAllSuppliers = async () => allSuppliers.execute();

export const getSupplierById = async (id: number) =>
    supplierSelectById.execute({ id });

export const insertSupplier = async (newSupplier: NewSupplier) =>
    db.insert(supplier).values(newSupplier);

export const deleteSupplierById = async (id: number) =>
    supplierDeleteById.execute({ id });

export const updateSupplierById = async (
    id: number,
    newSupplier: NewSupplier,
) => db.update(supplier).set(newSupplier).where(eq(supplier.supplierId, id));