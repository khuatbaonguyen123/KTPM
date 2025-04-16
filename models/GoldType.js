export default (sequelize, DataTypes) => {
  const GoldType = sequelize.define(
    'GoldType',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      tableName: 'gold_types',
      timestamps: false // No timestamps for this table
    }
  );

  return GoldType;
};
