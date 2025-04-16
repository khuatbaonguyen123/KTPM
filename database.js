import { Sequelize } from "sequelize";

const sequelize = new Sequelize('gold_price_2', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// Function to check the database connection
export async function checkDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default sequelize;
