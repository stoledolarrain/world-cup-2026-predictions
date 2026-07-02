import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string({ message: 'El nombre es obligatorio' })
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
    
  email: z.string({ message: 'El correo electrónico es obligatorio' })
    .email('Formato de correo inválido'),
    
  password: z.string({ message: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string({ message: 'El correo electrónico es obligatorio' })
    .email('Formato de correo inválido'),
    
  password: z.string({ message: 'La contraseña es obligatoria' }),
});