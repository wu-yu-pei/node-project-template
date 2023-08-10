import { DataTypes } from 'sequelize';
import { sequelize } from '../../database/index';

const Image = sequelize.define(
  'images',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    news_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    url: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

Image.sync({ alter: false });

export default Image;
