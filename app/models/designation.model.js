module.exports = (sequelize, Sequelize) => {
    const Designation = sequelize.define("designations", {
        partner_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            foreignKey: true,
            references: {
                model: 'patner_groups', // 'patner_groups' refers to table name
                key: 'id', // 'id' refers to column name in persons table
             }
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        active: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            defaultValue: 1,
        },
        created_at: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          updated_at: {
            type: 'TIMESTAMP',
            allowNull: true,
           
          }
    });

    return Designation;
};