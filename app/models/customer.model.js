module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define("customers", {
        customer_id: {
            type: Sequelize.STRING(8),
            allowNull: false,
        },
        branch_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            foreignKey: true,
            references: {
                model: 'branches',
                key: 'id',
            }
        },
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            foreignKey: true,
            references: {
                model: 'users',
                key: 'id',
            }
        },
        title: {
            allowNull: false,
            type: Sequelize.STRING
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING(500)
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
            type: Sequelize.STRING
        },
        contact_number: {
            allowNull: false,
            type: Sequelize.STRING(25)
        },
        date_of_birth: {
            allowNull: false,
            type: Sequelize.DATE,

        },
        gender: {
            allowNull: false,
            type: Sequelize.STRING(20)
        },

        country_id: {
            type: Sequelize.INTEGER,
            foreignKey: true,
            references: {
                model: 'countries',
                key: 'id',
            }
        },
        image: {
            allowNull: true,
            type: Sequelize.TEXT('long')
        },
        wr_subscription: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            defaultValue: 1,
        },
        no_of_properties: {
            allowNull: false,
            type: Sequelize.INTEGER,
        },
        active: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            defaultValue: 1,
        },
        created_by: {
            allowNull: false,
            type: Sequelize.INTEGER,
            foreignKey: true,
            references: {
                model: 'users', // 'users' refers to table name
                key: 'id', // 'id' refers to column name in persons table
            }

        },
        modified_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            foreignKey: true,
            references: {
                model: 'users', // 'users' refers to table name
                key: 'id', // 'id' refers to column name in persons table
            }

        },
        created_at: {
            type: 'TIMESTAMP',
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
        updated_at: {
            type: 'TIMESTAMP',
            allowNull: true,

        },
        deleted: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
        },
        deleted_at: {
            type: 'TIMESTAMP',
            allowNull: true,

        },
        deleted_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            foreignKey: true,
            references: {
                model: 'users', // 'users' refers to table name
                key: 'id', // 'id' refers to column name in persons table
            }

        }

    });

    return Customer;
};