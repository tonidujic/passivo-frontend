import { z } from 'zod'

export const signUpSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),

    email: z.email('Enter a valid email address'),

    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const changePasswordValidator = z.object({
  currentAuthKey: z.string().min(1),
  newAuthKey: z.string().min(1),
  salt: z.string().min(1),
  privateKey: z.string().min(1),
  iv: z.string().min(1),
})
