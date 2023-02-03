const moment = require("moment");

function startOfDate(momentDate) {
  return moment(momentDate).hour(0).minutes(0).seconds(0).milliseconds(0);
}

function endOfDate(startOfDate) {
  return moment(startOfDate).add(1, "days").subtract(1, "seconds");
}

function getDateRange() {
  const startPeriod = startOfDate(moment().subtract(23, "hours").day("Sunday")).add(10, "hours");
  const endPeriod = endOfDate(moment(startPeriod).add(6, "days")); // 6


  console.log('****************************************', startPeriod, endPeriod);

  // Start and End at 6 am
  return [
    startPeriod,
    endPeriod,
  ];
}

module.exports = {
  startOfDate,
  endOfDate,
  getDateRange,
}
