module.exports = (sequelize, DataTypes) => {
  const AccessToken = sequelize.define(
    'AccessToken',
    {
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
      token: DataTypes.STRING,
      refreshToken: {
        type: DataTypes.STRING,
        field: 'refresh_token',
      },
      expired: DataTypes.BOOLEAN,
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    { tableName: 'access_tokens' },
  );
  AccessToken.associate = function associate(models) {
    models.AccessToken.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return AccessToken;
};
