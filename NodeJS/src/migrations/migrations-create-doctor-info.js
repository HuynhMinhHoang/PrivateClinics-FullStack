"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("doctor_infos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      priceId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provinceId: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      specialtyId: {
        type: Sequelize.INTEGER,
      },
      
      clinicId: {
        type: Sequelize.INTEGER,
      },

      paymentId: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      addressClinic: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      nameClinic: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      note: {
        type: Sequelize.STRING,
        // allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("doctor_info");
  },
};
