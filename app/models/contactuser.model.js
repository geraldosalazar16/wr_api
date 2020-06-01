module.exports = (sequelize, Sequelize) => {
    const ContactUser = sequelize.define("customers_contact_users", {
        customer_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            foreignKey: true,
            references: {
                model: 'customers',
                key: 'id', 
             },
             unique: 'uniqueEmail',
        },
        first_name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        last_name: {
            allowNull: false,
            type: Sequelize.STRING
        },
         email: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: 'uniqueEmail',
        },
        contact_number: {
            allowNull: false,
            type: Sequelize.STRING(25)
        },
        date_of_birth: {
            allowNull: false,
            type: Sequelize.DATE,
          
        }
    });

    return ContactUser;
};