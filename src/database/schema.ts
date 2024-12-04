import { sql } from "drizzle-orm";
import { boolean, date, index, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

// user token table
export type user_tokensType = typeof user_tokens.$inferSelect;
export const user_tokens = pgTable('user_tokens', {
    user_id: serial('user_id').references(() => users.user_id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    token: varchar('token'),
}, (table) => {
    return {
        userTokenIndex: index('user_token_idx').on(table.token),
    }
})

// admin token table
export type admin_tokensType = typeof admin_tokens.$inferSelect;
export const admin_tokens = pgTable('admin_tokens', {
    admin_id: serial('admin_id').references(() => administrators.admin_id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    token: varchar('token'),
}, (table) => {
    return {
        adminTokenIndex: index('admin_token_idx').on(table.token),
    }
})

// user table
export type usersType = typeof users.$inferSelect;
export const users = pgTable('users', {
    user_id: serial('user_id').primaryKey(),
    name: varchar('name', { length: 50 }),
    password: varchar('password', { length: 255 }).default('12345'),
    address: varchar('address', { length: 50 }),
    phone: varchar('phone', { length: 20 }),
    rt: varchar('rt', { length: 10 }),
}, (table) => {
    return {
        userNameIndex: index('user_name_idx').on(table.name),
        userAddressIndex: index('user_address_idx').on(table.address),
        userRTIndex: index('user_rt_idx').on(table.rt),
    }
})

// admin table
export type administratorsType = typeof administrators.$inferSelect;
export const administrators = pgTable('administrators', {
    admin_id: serial('admin_id').primaryKey(),
    name: varchar('name', { length: 50 }),
    password: varchar('password', { length: 255 }).default('12345'),
    phone: varchar('phone', { length: 20 }),
}, (table) => {
    return {
        adminNameIndex: index('admin_name_idx').on(table.name),
        adminPhoneIndex: index('admin_phone_idx').on(table.phone),
    }
})

// fee table
export type feesType = typeof fees.$inferSelect;
export const fees = pgTable('fees', {
    fee_id: serial('fee_id').primaryKey(),
    fee_amount: integer('fee_amount'),
    fee_date: varchar('fee_date').unique(),
}, (table) => {
    return {
        feeDateIndex: index('fee_date_idx').on(table.fee_date),
    }
})

// payment table
export type paymentsType = typeof payments.$inferSelect;
export const payments = pgTable('payments', {
    payment_id: serial('payment_id').primaryKey(),
    fee_id: serial('fee_id').references(() => fees.fee_id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    user_id: serial('user_id').references(() => users.user_id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    payment_date: date('payment_date').default(sql`NOW()`),
    payment_status: boolean('payment_status').default(false),
    payment_description: varchar('payment_description', { length: 255 }).default('undone'),
    last_update: timestamp('last_update').default(sql`NOW()`),
}, (table) => {
    return {
        paymentStatusIndex: index('payment_status_idx').on(table.payment_status),
        paymentDescIndex: index('payment_desc_idx').on(table.payment_description),
    }
})

// notification table
export type notificationsType = typeof notifications.$inferSelect;
export const notifications = pgTable('notifications', {
    notification_id: serial('notification_id').primaryKey(),
    user_id: serial('user_id').references(() => users.user_id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    notification_title: varchar('notification_title', { length: 50 }),
    notification_content: varchar('notification_content'),
    notification_date: timestamp('notification_date').default(sql`NOW()`),
})