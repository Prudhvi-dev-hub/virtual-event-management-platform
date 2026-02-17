import { mysqlTable, varchar, serial, timestamp,mysqlEnum,datetime,bigint } from "drizzle-orm/mysql-core";
import { sql } from 'drizzle-orm';

export const admins = mysqlTable("admins", {
  id: serial('id').primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", {withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),

  // DATETIME avoids old MySQL "one timestamp only" restriction
  updatedAt: datetime("updated_at", { mode: "string" })
    .notNull(),

  // Nullable without default to avoid errors
  deletedAt: datetime("deleted_at", { mode: "string" })
});

export const participants = mysqlTable("participants", {
  id: serial('id').primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", {withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),

  // DATETIME avoids old MySQL "one timestamp only" restriction
  updatedAt: datetime("updated_at", { mode: "string" })
    .notNull(),

  // Nullable without default to avoid errors
  deletedAt: datetime("deleted_at", { mode: "string" })
});

export const eventManagement = mysqlTable("event_planner", {
  id: serial('id').primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  startDate: datetime("start_date", { mode: "string" }).notNull(),
  endDate: datetime("end_date", { mode: "string" }).notNull(),
  status: mysqlEnum("status", ['upcoming','ongoing','completed']).notNull().default('upcoming'), // upcoming, ongoing, completed
  location: mysqlEnum("location", ['online','offline']).notNull().default('online'), // online, offline
  createdAt: timestamp("created_at", {withTimezone: true, mode: "string" })
    .default(sql`now()`)
    .notNull(),

  // DATETIME avoids old MySQL "one timestamp only" restriction
  updatedAt: datetime("updated_at", { mode: "string" }),    

  // Nullable without default to avoid errors
  deletedAt: datetime("deleted_at", { mode: "string" })
});

export const eventRegistrations = mysqlTable("event_enrollments", {
  id: serial('id').primaryKey(),
  // Match eventManagement.id (serial = unsigned BIGINT)
  eventId: bigint("event_id", { mode: "number", unsigned: true })
    .references(() => eventManagement.id)
    .notNull(),

  // Match participants.id (serial = unsigned BIGINT)
  participantId: bigint("participant_id", { mode: "number", unsigned: true })
    .references(() => participants.id)
    .notNull(),
  status: mysqlEnum("status",['registered','attended','missed']).notNull().default('registered'), // registered, attended, missed  
   createdAt: timestamp("created_at", { mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  // Use DATETIME without default (set updatedAt in app code)
  updatedAt: datetime("updated_at", { mode: "string" }),    

  deletedAt: datetime("deleted_at", { mode: "string" })
});