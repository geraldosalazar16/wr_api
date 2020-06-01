module.exports = (sequelize, Sequelize) => {
    const AuditLog = sequelize.define("audit_log", {
        activity_name: {
        allowNull: false,
        type: Sequelize.STRING
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
      module_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      activity_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
    },
    });
  
    return AuditLog;
  };