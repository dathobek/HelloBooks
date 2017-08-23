import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config/config';

require('dotenv').config();

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const configg = config[env];

const db = {};

let sequelize;
if (configg.use_env_variable) {
  sequelize = new Sequelize(process.env[configg.use_env_variable]);
} else {
  sequelize = new Sequelize(
    configg.database, configg.username, configg.password, configg);
}

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
