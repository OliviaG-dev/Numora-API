import { z } from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const authCredentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(10).max(128)
});

export const numerologyCalculationSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    birthDate: z.string().regex(isoDateRegex, "birthDate must be YYYY-MM-DD"),
    address: z
      .object({
        streetNumber: z.string().trim().min(1).max(16),
        streetName: z.string().trim().min(1).max(120),
        allowMasterNumbers: z.boolean().optional()
      })
      .optional(),
    locality: z
      .object({
        postalCode: z.string().trim().min(2).max(12),
        city: z.string().trim().min(1).max(80),
        allowMasterNumbers: z.boolean().optional()
      })
      .optional(),
    referenceDate: z
      .string()
      .regex(isoDateRegex, "referenceDate must be YYYY-MM-DD")
      .optional()
  })
  .strict();
