const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Request = sequelize.define('requests', {
    request_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

module.exports = Request;
