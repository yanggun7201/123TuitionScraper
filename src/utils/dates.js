const moment = require("moment");

function startOfDate(momentDate) {
  return moment(momentDate).hour(0).minutes(0).seconds(0).milliseconds(0);
}

function endOfDate(startOfDate) {
  return moment(startOfDate).add(1, "days").subtract(1, "seconds");
}

function getDateRange() {
  const startPeriod = startOfDate(moment().subtract(4, "hours").day("Sunday"));
  const endPeriod = endOfDate(moment(startPeriod).add(6, "days")); // 6

  return [startPeriod, endPeriod];
}

module.exports = {
  startOfDate,
  endOfDate,
  getDateRange,
}
