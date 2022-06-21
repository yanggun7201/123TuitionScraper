const moment = require("moment");

function startOfDate(momentDate) {
  return moment(momentDate).hour(0).minutes(0).seconds(0).milliseconds(0);
}

function endOfDate(startOfDate) {
  return moment(startOfDate).add(1, "days").subtract(1, "seconds");
}

module.exports = {
  startOfDate,
  endOfDate,
}
