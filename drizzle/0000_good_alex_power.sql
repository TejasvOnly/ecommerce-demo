CREATE TABLE IF NOT EXISTS "ecommerce-demo_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ecommerce-demo_otp" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"value" varchar(8) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expired_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ecommerce-demo_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ecommerce-demo_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"hash" varchar(256) NOT NULL,
	"verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "ecommerce-demo_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ecommerce-demo_users_to_categories" (
	"user_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "ecommerce-demo_users_to_categories_user_id_category_id_pk" PRIMARY KEY("user_id","category_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ecommerce-demo_otp" ADD CONSTRAINT "ecommerce-demo_otp_user_id_ecommerce-demo_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ecommerce-demo_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ecommerce-demo_users_to_categories" ADD CONSTRAINT "ecommerce-demo_users_to_categories_user_id_ecommerce-demo_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ecommerce-demo_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ecommerce-demo_users_to_categories" ADD CONSTRAINT "ecommerce-demo_users_to_categories_category_id_ecommerce-demo_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ecommerce-demo_category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "ecommerce-demo_post" ("name");