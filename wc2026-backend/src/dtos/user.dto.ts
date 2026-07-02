export interface RegisterUserDto {
  name: string;
  email: string;
  password?: string; // Opcional al recibir, obligatorio al guardar
}

export interface LoginUserDto {
  email: string;
  password?: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  password?: string;
}