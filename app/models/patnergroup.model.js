module.exports = (sequelize, Sequelize) => {
    const PartnerGroup = sequelize.define("patner_group", {
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
  
    return PartnerGroup;
  };