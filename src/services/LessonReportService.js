const Sequelize = require("sequelize");
const { isEmpty } = require("lodash");
const { LessonReport } = require("../database/LessonReport.js");

const Op = Sequelize.Op;

async function findAll(startDate, endDate) {
  console.log('findAll() startDate ~ endDate', startDate, endDate);
  const options = { raw: true };

  if (!isEmpty(startDate) && !isEmpty(endDate)) {
    options.where = {
      ...options.where,
      date: {
        [Op.between]: [startDate, endDate]
      }
    }
  }

  return await LessonReport.findAll(options);
}

/**
 *
 * @param startDate 2022-10-10
 * @returns {Promise<GroupedCountResultItem[]>}
 */
async function getCountWithStartDate(startDate) {
  return await LessonReport.count({
    where: {
      date: {
        [Op.like]: `${startDate}%`
      }
    }
  });
}

async function getTotalCount() {
  return await LessonReport.count();
}

module.exports = {
  findAll,
  getCountWithStartDate,
  getTotalCount,
}
