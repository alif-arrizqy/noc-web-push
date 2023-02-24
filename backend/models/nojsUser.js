"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class NojsUser extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // NojsUser.belongsToMany(models.nojsLoggerModel, {
            //   through: "nojs_logger",
            //   foreignKey: "nojs_id",
            // });
            // NojsUser.hasMany(models.nojsLoggerModel, { as: "loggers" });
        }
    }
    NojsUser.init(
        {
            nojs: DataTypes.STRING,
            site: DataTypes.STRING,
            provinsi: DataTypes.STRING,
            lc: DataTypes.STRING,
            mitra: DataTypes.STRING,
            ip: DataTypes.STRING,
            latitude: DataTypes.STRING,
            longitude: DataTypes.STRING,
            id_lvd_vsat: DataTypes.INTEGER,
            id_ping: DataTypes.INTEGER,
            id_batt_volt: DataTypes.INTEGER,
            id_vsat_curr: DataTypes.INTEGER,
            id_bts_curr: DataTypes.INTEGER,
            gs: DataTypes.INTEGER,
            darat: DataTypes.STRING,
            laut: DataTypes.STRING,
            udara: DataTypes.STRING,
            createdAt: {
                type: DataTypes.DATE,
                field: "created_at",
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: "updated_at",
            },
        },
        {
            sequelize,
            modelName: "nojsUserModel",
            tableName: "nojs_users",
        }
    );
    return NojsUser;
};
