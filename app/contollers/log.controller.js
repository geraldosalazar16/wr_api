const db = require("../models");
const Log = db.auditLog;


function createAuditLog(data) {
    Log.create({
        module_name: data.module_name,
        activity_name: data.activity_name,
        created_by : data.created_by,
        status: data.status
    })
        .then(function (log) {
            return true;
        })
        .catch(err => {
          return false;
        });
}

exports.createAuditLog = createAuditLog;
