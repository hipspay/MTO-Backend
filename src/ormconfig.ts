require('dotenv').config();

const ormconfig = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: ['./src/entities/*.ts'],
    migrations: ['./src/migration/*.ts'],
    cli: {
        migrationsDir: './src/migration',
    },
};

export default ormconfig;
