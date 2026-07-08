const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // Connection string connection (e.g. Supabase, Neon, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log for debugging query logs
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
} else {
  // Individual connection parameter details (Local PG or specific configs)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'mediguardian',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    }
  );
}

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connection has been established successfully via Sequelize.');
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error.message);
  }
};

testConnection();

module.exports = sequelize;
