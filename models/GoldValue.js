export default (sequelize, DataTypes) => {
  const GoldValue = sequelize.define('GoldValue', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sell_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    buy_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    day: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    gold_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'gold_value',
    createdAt: false,
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['gold_type_id', 'day']
      }
    ]
  });

  return GoldValue;
};
