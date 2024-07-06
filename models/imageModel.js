const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Request = require('./requestModel');

const Image = sequelize.define('images', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    request_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    input_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    output_url: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});
Image.belongsTo(Request, { foreignKey: 'request_id', targetKey: 'request_id' });
Request.hasMany(Image, { foreignKey: 'request_id', sourceKey: 'request_id' });
module.exports = Image;
