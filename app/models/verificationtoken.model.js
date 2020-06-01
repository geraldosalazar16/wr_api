module.exports = (sequelize, Sequelize) => {
    const VerificationToken = sequelize.define("verification-tokens", {
        user_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            foreignKey: true,
            references: {
                model: 'users', // 'users' refers to table name
                key: 'id', // 'id' refers to column name in persons table
             }
        },
        token: {
            allowNull: false,
            type: Sequelize.STRING(500)
        },
        type: {
            allowNull: false,
            type: Sequelize.STRING(250)
        },
        created_at: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          expired_at: {
            type: 'TIMESTAMP',
            allowNull: true,
           
          }
    });

    return VerificationToken;
};