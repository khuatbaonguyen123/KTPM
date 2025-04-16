export default (sequelize, DataTypes) => {
  const GoldValue = sequelize.define(
    'GoldValue',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sell_value: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      buy_value: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      day: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      gold_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'gold_values',
      timestamps: false // No timestamps for this table
    }
  );

  return GoldValue;
};
