

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."current_tenant"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select nullif(
    current_setting('request.jwt.claims', true)::json ->> 'tenant_id',
    ''
  )::uuid;
$$;


ALTER FUNCTION "public"."current_tenant"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."llm_providers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "model_name" "text",
    "api_source" "text",
    "price_per_token" numeric,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."llm_providers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."voice_calls" (
    "id" bigint NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "persona_id" "uuid",
    "provider" "text" DEFAULT 'vapi'::"text" NOT NULL,
    "vapi_call_id" "text",
    "started_at" timestamp with time zone NOT NULL,
    "ended_at" timestamp with time zone,
    "duration_seconds" integer,
    "minutes_used" numeric,
    "minutes_billed" numeric,
    "call_status" "text" DEFAULT 'in-progress'::"text",
    "ended_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "voice_calls_call_status_check" CHECK (("call_status" = ANY (ARRAY['in-progress'::"text", 'ended'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."voice_calls" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."messages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."messages_id_seq" OWNED BY "public"."voice_calls"."id";



CREATE TABLE IF NOT EXISTS "public"."personas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "age" integer,
    "bio" "text",
    "image_url" "text",
    "bg_url" "text",
    "gender" "text" DEFAULT 'female'::"text",
    "premium_persona" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "vapi_assistant_id" "uuid",
    CONSTRAINT "personas_gender_check" CHECK (("gender" = ANY (ARRAY['male'::"text", 'female'::"text", 'non-binary'::"text", 'other'::"text", 'prefer_not_to_say'::"text"])))
);


ALTER TABLE "public"."personas" OWNER TO "postgres";


COMMENT ON COLUMN "public"."personas"."bg_url" IS 'Background hero image';



CREATE TABLE IF NOT EXISTS "public"."plan_caps" (
    "plan_id" "uuid" NOT NULL,
    "monthly_vapi_minutes_cap" integer DEFAULT 0,
    "monthly_llm_tokens_cap" integer DEFAULT 0,
    "monthly_avatar_seconds_cap" integer DEFAULT 0,
    "monthly_fc_cap" integer DEFAULT 0,
    "trial_vapi_minutes_cap" integer DEFAULT 0,
    "trial_llm_tokens_cap" integer DEFAULT 0,
    "trial_avatar_seconds_cap" integer DEFAULT 0,
    "trial_fc_cap" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."plan_caps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "price_usd" numeric(10,2) NOT NULL,
    "price_clp" integer,
    "currency" "text" DEFAULT 'USD'::"text",
    "trial_duration" interval DEFAULT '00:00:00'::interval,
    "plan_duration" interval DEFAULT '1 mon'::interval,
    "max_custom_personas" integer DEFAULT 0,
    "supports_voice" boolean DEFAULT true,
    "supports_avatars" boolean DEFAULT false,
    "supports_fc" boolean DEFAULT false,
    "supports_premium_personas" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "plan_id" "uuid" NOT NULL,
    "billing_status" "text" NOT NULL,
    "trial_ends_at" timestamp with time zone,
    "current_period_ends_at" timestamp with time zone,
    "canceled_at" timestamp with time zone,
    "stripe_subscription_id" "text",
    "mp_subscription_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "username" "text",
    "first_name" "text",
    "last_name" "text",
    "language" "text" DEFAULT 'es'::"text",
    "age" integer,
    "gender" "text" DEFAULT 'prefer_not_to_say'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "tenants_age_check" CHECK (("age" >= 0)),
    CONSTRAINT "tenants_gender_check" CHECK (("gender" = ANY (ARRAY['male'::"text", 'female'::"text", 'non-binary'::"text", 'other'::"text", 'prefer_not_to_say'::"text"])))
);


ALTER TABLE "public"."tenants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."usage_metrics" (
    "tenant_id" "uuid" NOT NULL,
    "period_start" "date" NOT NULL,
    "websocket_provider" "text" DEFAULT 'global'::"text" NOT NULL,
    "total_voice_calls" integer,
    "total_voice_minutes" integer,
    "total_avatar_calls" integer,
    "total_avatar_minutes" integer,
    "total_llm_tokens" integer,
    "total_function_calls" integer,
    "updated_at" timestamp with time zone,
    CONSTRAINT "usage_metrics_websocket_provider_check" CHECK (("websocket_provider" = ANY (ARRAY['vapi'::"text", 'hume'::"text", 'global'::"text"])))
);


ALTER TABLE "public"."usage_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vapi" (
    "vapi_assistant_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "vapi_cpm" numeric NOT NULL,
    "name" "text" NOT NULL,
    "gender" "text" NOT NULL,
    "language" "text" DEFAULT 'spanish'::"text",
    "stt_provider" "text",
    "llm_provider" "text",
    "tts_provider" "text",
    "sts_provider" "text",
    "voice_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."vapi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."voice_call_details" (
    "call_id" bigint NOT NULL,
    "transcript" "text",
    "summary" "text",
    "messages" "jsonb",
    "recording_url" "text",
    "end_of_call_report" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."voice_call_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."voice_call_integrations" (
    "voice_call_id" bigint NOT NULL,
    "avatar_id" "text",
    "function_call_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."voice_call_integrations" OWNER TO "postgres";


ALTER TABLE ONLY "public"."voice_calls" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."messages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."llm_providers"
    ADD CONSTRAINT "llm_providers_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."llm_providers"
    ADD CONSTRAINT "llm_providers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."voice_calls"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personas"
    ADD CONSTRAINT "personas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."plan_caps"
    ADD CONSTRAINT "plan_caps_pkey" PRIMARY KEY ("plan_id");



ALTER TABLE ONLY "public"."plans"
    ADD CONSTRAINT "plans_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."plans"
    ADD CONSTRAINT "plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_mp_subscription_id_key" UNIQUE ("mp_subscription_id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_stripe_subscription_id_key" UNIQUE ("stripe_subscription_id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."usage_metrics"
    ADD CONSTRAINT "usage_metrics_pkey" PRIMARY KEY ("tenant_id", "period_start");



ALTER TABLE ONLY "public"."vapi"
    ADD CONSTRAINT "vapi_voice_pkey" PRIMARY KEY ("vapi_assistant_id");



ALTER TABLE ONLY "public"."voice_call_details"
    ADD CONSTRAINT "voice_call_details_pkey" PRIMARY KEY ("call_id");



ALTER TABLE ONLY "public"."voice_call_integrations"
    ADD CONSTRAINT "voice_call_integrations_pkey" PRIMARY KEY ("voice_call_id");



ALTER TABLE ONLY "public"."voice_calls"
    ADD CONSTRAINT "voice_calls_vapi_call_id_key" UNIQUE ("vapi_call_id");



CREATE INDEX "subscriptions_tenant_status_idx" ON "public"."subscriptions" USING "btree" ("tenant_id", "billing_status");



CREATE INDEX "usage_metrics_date_idx" ON "public"."usage_metrics" USING "btree" ("period_start");



ALTER TABLE ONLY "public"."voice_calls"
    ADD CONSTRAINT "messages_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "public"."personas"("id");



ALTER TABLE ONLY "public"."voice_calls"
    ADD CONSTRAINT "messages_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id");



ALTER TABLE ONLY "public"."personas"
    ADD CONSTRAINT "personas_vapi_assistant_id_fkey" FOREIGN KEY ("vapi_assistant_id") REFERENCES "public"."vapi"("vapi_assistant_id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."plan_caps"
    ADD CONSTRAINT "plan_caps_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."usage_metrics"
    ADD CONSTRAINT "usage_metrics_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."voice_call_details"
    ADD CONSTRAINT "voice_call_details_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "public"."voice_calls"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."voice_call_integrations"
    ADD CONSTRAINT "voice_call_integrations_voice_call_id_fkey" FOREIGN KEY ("voice_call_id") REFERENCES "public"."voice_calls"("id") ON DELETE CASCADE;



CREATE POLICY "Deny all access" ON "public"."usage_metrics" USING (false);



ALTER TABLE "public"."llm_providers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."personas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."plan_caps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."plans" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public read llm providers" ON "public"."llm_providers" FOR SELECT USING (true);



CREATE POLICY "public read personas" ON "public"."personas" FOR SELECT USING (true);



ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "tenant owns row" ON "public"."tenants" FOR SELECT USING (("id" = "public"."current_tenant"()));



ALTER TABLE "public"."tenants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."usage_metrics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vapi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."voice_call_details" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."voice_call_integrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."voice_calls" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."current_tenant"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_tenant"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_tenant"() TO "service_role";


















GRANT ALL ON TABLE "public"."llm_providers" TO "anon";
GRANT ALL ON TABLE "public"."llm_providers" TO "authenticated";
GRANT ALL ON TABLE "public"."llm_providers" TO "service_role";



GRANT ALL ON TABLE "public"."voice_calls" TO "anon";
GRANT ALL ON TABLE "public"."voice_calls" TO "authenticated";
GRANT ALL ON TABLE "public"."voice_calls" TO "service_role";



GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."personas" TO "anon";
GRANT ALL ON TABLE "public"."personas" TO "authenticated";
GRANT ALL ON TABLE "public"."personas" TO "service_role";



GRANT ALL ON TABLE "public"."plan_caps" TO "anon";
GRANT ALL ON TABLE "public"."plan_caps" TO "authenticated";
GRANT ALL ON TABLE "public"."plan_caps" TO "service_role";



GRANT ALL ON TABLE "public"."plans" TO "anon";
GRANT ALL ON TABLE "public"."plans" TO "authenticated";
GRANT ALL ON TABLE "public"."plans" TO "service_role";



GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."tenants" TO "anon";
GRANT ALL ON TABLE "public"."tenants" TO "authenticated";
GRANT ALL ON TABLE "public"."tenants" TO "service_role";



GRANT ALL ON TABLE "public"."usage_metrics" TO "anon";
GRANT ALL ON TABLE "public"."usage_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."usage_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."vapi" TO "anon";
GRANT ALL ON TABLE "public"."vapi" TO "authenticated";
GRANT ALL ON TABLE "public"."vapi" TO "service_role";



GRANT ALL ON TABLE "public"."voice_call_details" TO "anon";
GRANT ALL ON TABLE "public"."voice_call_details" TO "authenticated";
GRANT ALL ON TABLE "public"."voice_call_details" TO "service_role";



GRANT ALL ON TABLE "public"."voice_call_integrations" TO "anon";
GRANT ALL ON TABLE "public"."voice_call_integrations" TO "authenticated";
GRANT ALL ON TABLE "public"."voice_call_integrations" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
