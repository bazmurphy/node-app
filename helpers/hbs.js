// bring in moment js
const moment = require("moment");

module.exports = {
  // create a function that takes in a date and a format we specify
  // and returns moment applied on that date and the moment format of the format we specify
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
}