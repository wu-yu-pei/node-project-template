import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/index';
import Image from '../upload/image.model';

const News = sequelize.define(
  'news',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    view: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    createdAt: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: +new Date(),
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

News.sync({ alter: false });

// 关联一下
News.hasMany(Image, { sourceKey: 'id', foreignKey: 'news_id' });

Image.belongsTo(News, { foreignKey: 'news_id', targetKey: 'id' });

export default News;
