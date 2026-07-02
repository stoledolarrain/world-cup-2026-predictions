import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    // synchronize en true lee tus Entidades y crea las tablas automáticamente en PostgreSQL.
    // OJO: Es muy útil para desarrollo, pero en producción debe ir en false (usaremos migraciones).
    synchronize: true, 
    logging: false, // Cambia a true si quieres ver las consultas SQL en la consola
    
    // Rutas donde TypeORM buscará tus tablas y migraciones
    entities: [__dirname + '/../entities/*.{ts,js}'],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    subscribers: [],
});