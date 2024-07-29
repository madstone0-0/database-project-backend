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
import { InferSelectModel, InferInsertModel, eq, sql, and } from "drizzle-orm";
import db from "../../db";

export const staff = mysqlTable("staff", {
    staffId: serial("staff_id").primaryKey(),
    firstName: varchar("first_name", { length: 40 }).notNull(),
    lastName: varchar("last_name", { length: 40 }).notNull(),
    position: varchar("position", { length: 40 }).notNull(),
    email: varchar("email", { length: 40 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 40 }).notNull(),
    address: varchar("address", { length: 40 }).notNull(),
    hireDate: date("hire_date")
        .notNull()
        .default(sql`CURRENT_DATE()`),
    salary: double("salary", { scale: 10, precision: 4 }).notNull(),
});

export type Staff = InferSelectModel<typeof staff>;
export type NewStaff = InferInsertModel<typeof staff>;

const allStaff = db.select().from(staff).orderBy(staff.staffId);
const staffSelectById = db
    .select()
    .from(staff)
    .where(eq(staff.staffId, sql.placeholder("id")));

const positions = db
    .selectDistinct({ position: staff.position })
    .from(staff)
    .orderBy(staff.position);

const staffSelectByPosition = db
    .select()
    .from(staff)
    .where(
        sql`lower(${staff.position}) = lower(${sql.placeholder("position")})`,
    );

const staffSelectByFirstAndLastName = db
    .select()
    .from(staff)
    .where(
        and(
            sql`lower(${staff.firstName}) = lower(${sql.placeholder("first")})`,
            sql`lower(${staff.lastName}) = lower(${sql.placeholder("last")})`,
        ),
    );

const staffDeleteById = db
    .delete(staff)
    .where(eq(staff.staffId, sql.placeholder("id")));

export const getAllStaff = async () => allStaff.execute();

export const getStaffById = async (id: number) =>
    staffSelectById.execute({ id });

export const getStaffByPosition = async (position: string) =>
    staffSelectByPosition.execute({ position });

export const insertStaff = async (newStaff: NewStaff) =>
    db.insert(staff).values(newStaff);

export const deleteStaffById = async (id: number) =>
    staffDeleteById.execute({ id });

export const updateStaffById = async (id: number, newStaff: NewStaff) =>
    db.update(staff).set(newStaff).where(eq(staff.staffId, id));

export const getStaffPositions = async () => positions.execute();

export const getStaffByFirstAndLastName = async (first: string, last: string) =>
    staffSelectByFirstAndLastName.execute({ first, last });

// export const getWaitersAndChefs = async() => db.select().from()
