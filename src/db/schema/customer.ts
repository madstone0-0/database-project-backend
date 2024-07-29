import { mysqlTable, varchar, serial } from "drizzle-orm/mysql-core";
import { InferSelectModel, InferInsertModel, eq, sql, and } from "drizzle-orm";
import db from "../../db";

export const customer = mysqlTable("customer", {
    customerId: serial("customer_id").primaryKey(),
    firstName: varchar("first_name", { length: 40 }).notNull(),
    lastName: varchar("last_name", { length: 40 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 40 }).notNull(),
    email: varchar("email", { length: 40 }).notNull(),
    address: varchar("address", { length: 40 }),
});

export type Customer = InferSelectModel<typeof customer>;
export type NewCustomer = InferInsertModel<typeof customer>;

const allCustomers = db.select().from(customer).orderBy(customer.customerId);

const customerSelectById = db
    .select()
    .from(customer)
    .where(eq(customer.customerId, sql.placeholder("id")));

const customerSelectByFirstAndLastName = db
    .select()
    .from(customer)
    .where(
        and(
            sql`lower(${customer.firstName}) = lower(${sql.placeholder("first")})`,
            sql`lower(${customer.lastName}) = lower(${sql.placeholder("last")})`,
        ),
    );

const customerDeleteById = db
    .delete(customer)
    .where(eq(customer.customerId, sql.placeholder("id")));

export const getAllCustomers = async () => allCustomers.execute();

export const getCustomerById = async (id: number) =>
    customerSelectById.execute({ id });

export const insertCustomer = async (newCustomer: NewCustomer) =>
    db.insert(customer).values(newCustomer);

export const deleteCustomerById = async (id: number) =>
    customerDeleteById.execute({ id });

export const updateCustomerById = async (
    id: number,
    newCustomer: NewCustomer,
) => db.update(customer).set(newCustomer).where(eq(customer.customerId, id));

export const getCustomerByFirstAndLastName = async (
    first: string,
    last: string,
) => customerSelectByFirstAndLastName.execute({ first, last });
