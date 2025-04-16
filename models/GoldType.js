export default (sequelize, DataTypes) => {
  const GoldType = sequelize.define('GoldType', {
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
  }, {
    tableName: 'gold_type',
    timestamps: false,
  });

  return GoldType;
};
