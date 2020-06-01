module.exports = (sequelize, Sequelize) => {
    const CustomerSubscription = sequelize.define("customers_contact_subscriptions", {
        customer_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            foreignKey: true,
            references: {
                model: 'customers',
                key: 'id', 
             }
        },
        subscription_type: {
            allowNull: false,
            type: Sequelize.STRING
        },
        subscripton_start_date: {
            allowNull: false,
            type: Sequelize.DATE
        },
        subscription_description: {
            allowNull: false,
            type: Sequelize.TEXT,
           
        },
        subscripton_end_date: {
            allowNull: false,
            type: Sequelize.DATE
        },
        subscripton_amount: {
            allowNull: false,
            type: Sequelize.INTEGER,
          
        },
        revenue_share_amount: {
            allowNull: false,
            type: Sequelize.INTEGER,
          
        },
        created_by: {
            allowNull: false,
            type: Sequelize.INTEGER,
            foreignKey: true,
            references: {
                model: 'users', 
                key: 'id',
             }
    
        },
        modified_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
            foreignKey: true,
            references: {
                model: 'users', 
                key: 'id',
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
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true,
           
          }
        
    });

    return CustomerSubscription;
};