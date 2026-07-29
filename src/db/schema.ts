import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  text,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

// Профиль регуляции пользователя (результат первичного профилирования)
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userKey: varchar('user_key', { length: 64 }).notNull().unique(),
  profileType: varchar('profile_type', { length: 20 }).notNull(), // impulsive | hypercontrol
  impulsiveScore: integer('impulsive_score').notNull().default(0),
  hypercontrolScore: integer('hypercontrol_score').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Обращение пользователя: эмоция + интенсивность + подобранные навыки
export const entries = pgTable(
  'entries',
  {
    id: serial('id').primaryKey(),
    userKey: varchar('user_key', { length: 64 }).notNull(),
    emotion: varchar('emotion', { length: 40 }).notNull(),
    subtype: varchar('subtype', { length: 40 }),
    intensity: integer('intensity').notNull(),
    crisis: boolean('crisis').notNull().default(false),
    level: varchar('level', { length: 10 }).notNull(), // low | medium | high
    skills: jsonb('skills').$type<string[]>().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('entries_user_idx').on(t.userKey, t.createdAt)],
);

// Отметки о выполнении навыков + заметки
export const skillLogs = pgTable(
  'skill_logs',
  {
    id: serial('id').primaryKey(),
    entryId: integer('entry_id')
      .notNull()
      .references(() => entries.id, { onDelete: 'cascade' }),
    userKey: varchar('user_key', { length: 64 }).notNull(),
    skillId: varchar('skill_id', { length: 60 }).notNull(),
    done: boolean('done').notNull().default(false),
    note: text('note').notNull().default(''),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [uniqueIndex('skill_logs_entry_skill').on(t.entryId, t.skillId)],
);
