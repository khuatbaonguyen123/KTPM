import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GoldPrice = sequelize.define('GoldPrice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'gold_price',
  timestamps: false,
});

export default GoldPrice;
