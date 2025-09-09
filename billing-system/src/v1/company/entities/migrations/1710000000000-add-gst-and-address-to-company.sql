-- Adds nullable gst_number and address to the implicit "company" table
-- Adjust table name if your naming strategy differs
ALTER TABLE "company"
  ADD COLUMN IF NOT EXISTS "gst_number" VARCHAR(20) NULL,
  ADD COLUMN IF NOT EXISTS "address" TEXT NULL;

