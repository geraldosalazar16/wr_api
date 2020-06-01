
// Creating our User model
//Set it as export because we will need it required on the server
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        partner_id: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
            model: 'patner_groups', 
            key: 'id',
         }
        
      },
      company_code: {
        type: Sequelize.STRING(20)
      },
     
      title: {
        allowNull: false,
        type: Sequelize.STRING
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
    designation_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
            model: 'designations', 
            key: 'id',
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
      role_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
            model: 'roles', 
            key: 'id',
         }
       
      },
      password: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      user_name: {
        allowNull: false,
        type: Sequelize.STRING
    },
      contact_number_1: {
       
        type: Sequelize.STRING
    },
    active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
    },
    deleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
    branch_id: {
        type: Sequelize.INTEGER,
        
    },
    company_id: {
        type: Sequelize.INTEGER,
        
    },
    branch_id: {
             type: Sequelize.INTEGER,
      },
        
    address_1: {
        type: Sequelize.STRING
    },
    address_2: {
        type: Sequelize.STRING
    },
    address_3: {
        type: Sequelize.STRING
    },
    subrub: {
        type: Sequelize.STRING
    },
    state_id: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
            model: 'states',
            key: 'id', 
         }

    },
    country_id: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
            model: 'countries', 
            key: 'id', 
         }
    },
    postal_code: {
        type: Sequelize.STRING
    },
    is_verified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
    },
    company_name: {
        type: Sequelize.STRING
    },
    
    contact_number_2: {
        type: Sequelize.STRING
    },
    created_by: {
        allowNull: true,
        type: Sequelize.INTEGER,
        foreignKey: true,
        

    },
    modified_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        foreignKey: true,
      

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
      }
    });
    return User;
  };