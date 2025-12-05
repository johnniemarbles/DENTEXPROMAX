
import { z } from 'zod';

export const insertClinicSchema = z.object({
  name: z.string().min(2, "Clinic name must be at least 2 characters"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  address: z.string().optional(),
  city: z.string().min(2, "City is required"),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional(),
});

export const insertAppointmentSchema = z.object({
  clinic_id: z.string().uuid(),
  patient_id: z.string().uuid().optional(),
  family_member_id: z.string().optional().nullable(),
  requested_time: z.string().datetime(),
  service_type: z.string().min(3, "Service type is required"),
  notes: z.string().max(500).optional(),
});

export const insertProductSchema = z.object({
  vendor_id: z.string().uuid(),
  name: z.string().min(2, "Product name is too short"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock_count: z.number().int().min(0),
  category: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type InsertClinicValues = z.infer<typeof insertClinicSchema>;
export type InsertAppointmentValues = z.infer<typeof insertAppointmentSchema>;
export type InsertProductValues = z.infer<typeof insertProductSchema>;
