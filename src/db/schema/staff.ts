import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    date,
    decimal,
    serial,
} from "drizzle-orm/mysql-core";
import {
    InferSelectModel,
    or,
    InferInsertModel,
    eq,
    sql,
    and,
    isNull,
    count,
} from "drizzle-orm";
import db from "../../db";
import { order } from "./order";

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
    salary: decimal("salary", { scale: 10, precision: 4 }).notNull(),
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
    await db.insert(staff).values(newStaff);

export const deleteStaffById = async (id: number) =>
    staffDeleteById.execute({ id });

export const updateStaffById = async (id: number, newStaff: NewStaff) =>
    await db.update(staff).set(newStaff).where(eq(staff.staffId, id));

export const getStaffPositions = async () => positions.execute();

export const getStaffByFirstAndLastName = async (first: string, last: string) =>
    staffSelectByFirstAndLastName.execute({ first, last });

export const getWaitersAndChefs = async () =>
    await db
        .select({
            staffId: staff.staffId,
            firstName: staff.firstName,
            lastName: staff.lastName,
            position: staff.position,
            hireDate: staff.hireDate,
        })
        .from(staff)
        .where(
            or(
                sql`lower(${staff.position}) = lower("waiter")`,
                sql`lower(${staff.position}) = lower("chef")`,
            ),
        )
        .orderBy(staff.hireDate);

export const getOrdersByWaiter = async () =>
    await db
        .select({
            staffId: staff.staffId,
            firstName: staff.firstName,
            lastName: staff.lastName,
            totalOrders: count(order.orderId),
        })
        .from(staff)
        .innerJoin(order, eq(staff.staffId, order.staffId))
        .where(
            and(
                sql`${order.orderId} IS NOT NULL`,
                sql`lower(${staff.position}) = lower("waiter")`,
            ),
        )
        .groupBy(staff.staffId, staff.firstName, staff.lastName);
