CREATE TABLE "entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_key" varchar(64) NOT NULL,
	"emotion" varchar(40) NOT NULL,
	"subtype" varchar(40),
	"intensity" integer NOT NULL,
	"crisis" boolean DEFAULT false NOT NULL,
	"level" varchar(10) NOT NULL,
	"skills" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_key" varchar(64) NOT NULL,
	"profile_type" varchar(20) NOT NULL,
	"impulsive_score" integer DEFAULT 0 NOT NULL,
	"hypercontrol_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_key_unique" UNIQUE("user_key")
);
--> statement-breakpoint
CREATE TABLE "skill_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"entry_id" integer NOT NULL,
	"user_key" varchar(64) NOT NULL,
	"skill_id" varchar(60) NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "skill_logs" ADD CONSTRAINT "skill_logs_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entries_user_idx" ON "entries" USING btree ("user_key","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "skill_logs_entry_skill" ON "skill_logs" USING btree ("entry_id","skill_id");