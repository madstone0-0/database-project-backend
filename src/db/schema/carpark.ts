import {
    int,
    mysqlEnum,
    mysqlTable,
    uniqueIndex,
    varchar,
    date,
    double,
    boolean,
    serial,
} from "drizzle-orm/mysql-core";
import { InferSelectModel, InferInsertModel, eq, sql } from "drizzle-orm";
import db from "../../db";

export const carpark = mysqlTable("carpark", {
    positionId: int("position_id").primaryKey(),
    occupied: boolean("occupied"),
    specialNeeds: boolean("special_needs"),
    vip: boolean("vip"),
});

export type Carpark = InferSelectModel<typeof carpark>;
export type NewCarpark = InferInsertModel<typeof carpark>;
