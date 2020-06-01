module.exports = (sequelize, Sequelize) => {
    const Branch = sequelize.define("branches", {
        company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'users', // 'users' refers to table name
            key: 'id', // 'id' refers to column name in persons table
         }
        
      },
      business_id: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
        references: {
            model: 'business_informations', 
            key: 'id',
         }
        
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING(25)
      },
     
      name: {
        allowNull: false,
        type: Sequelize.STRING(500)
    },
    contact_number: {
        allowNull: false,
        type: Sequelize.STRING(25)
    },

    address_1: {
        type: Sequelize.STRING(500),
        allowNull: false,
    },
    address_2: {
        type: Sequelize.STRING(500),
        allowNull: false,
    },
    address_3: {
        type: Sequelize.STRING(500),
        allowNull: false,
    },
    subrub: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'states', // 'users' refers to table name
            key: 'id', // 'id' refers to column name in persons table
         }

    },
    country_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    postal_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
    },
    deleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
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
  
    return Branch;
  };