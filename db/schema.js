import { mysqlTable, varchar, serial, timestamp,mysqlEnum,datetime,int } from "drizzle-orm/mysql-core";
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

export const eventManagement = mysqlTable("event_booking_board", {
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
  updatedAt: datetime("updated_at", { mode: "string" })
    .notNull(),

  // Nullable without default to avoid errors
  deletedAt: datetime("deleted_at", { mode: "string" })
});

export const eventRegistrations = mysqlTable("event_registry_board", {
  id: serial('id').primaryKey(),
  eventId: int("event_id").references(()=>eventManagement.id).notNull(),
  participantId: int("participant_id").references(()=>participants.id).notNull(),
  status: varchar("status", { enum: ['registered','attended','missed'] }).notNull().default('registered'), // registered, attended, missed
  // createdAt: timestamp({ mode: 'date', fsp: 6 })
  // .default(sql`now(6)`)
  // .notNull(),

  // // DATETIME avoids old MySQL "one timestamp only" restriction
  // updatedAt: datetime("updated_at", { mode: "string" })
  //   .notNull(),

  // // Nullable without default to avoid errors
  // deletedAt: datetime("deleted_at", { mode: "string" })
  createdAt: timestamp("created_at", { mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  // Use DATETIME without default (set updatedAt in app code)
  updatedAt: datetime("updated_at", { mode: "string" })
    .notNull(),

  deletedAt: datetime("deleted_at", { mode: "string" })
});