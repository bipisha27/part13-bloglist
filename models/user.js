const {Model, DataTypes} = require('sequelize')
const {sequelize} = require('../util/db')

class User extends Model {}

User.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false
  }
 },{
    sequelize,
    underscored: true,
    modelName: 'user'
  }
)

module.exports = User 