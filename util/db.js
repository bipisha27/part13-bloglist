require('dotenv').config()
const { Sequelize } = require('sequelize')

const isTest = process.env.TESTING === 'true'

const DATABASE_URL = isTest
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  }
})

module.exports = { sequelize }
