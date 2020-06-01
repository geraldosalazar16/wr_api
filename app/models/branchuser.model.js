module.exports = (sequelize, Sequelize) => {
    const BranchUser = sequelize.define("branch_user", {
        branch_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
            model: 'branches', 
            key: 'id',
         },
         unique: 'uniqueUser',
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
            model: 'users', 
            key: 'id',
         },
         unique: 'uniqueUser',

      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
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
    });
  
    return BranchUser;
  };