import { Sequelize, DataTypes } from 'sequelize';
import GoldTypeModel from './GoldType.js';
import GoldValueModel from './GoldValue.js';
import sequelize from '../database.js'; 

const GoldType = GoldTypeModel(sequelize, DataTypes);
const GoldValue = GoldValueModel(sequelize, DataTypes);

// Define the relationships
GoldType.hasMany(GoldValue, { foreignKey: 'gold_type_id' });
GoldValue.belongsTo(GoldType, { foreignKey: 'gold_type_id' });

export { GoldType, GoldValue };
