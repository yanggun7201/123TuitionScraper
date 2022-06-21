const path = require("path");

const SUBJECT_SELECT_SELECTOR = "#applicationId";
const STUDENT_SELECT_SELECTOR = "#studentId";
const COURSE_SELECT_SELECTOR = "#curriculumId";
const BASE_URL = "https://learning.123tuition.co.nz/";

const momentJsFilePath = path.join(global.ROOT_DIR, "/lib/moment/moment.min.js");

module.exports = {
  BASE_URL,
  SUBJECT_SELECT_SELECTOR,
  STUDENT_SELECT_SELECTOR,
  COURSE_SELECT_SELECTOR,
  JS_FILE_PATHS: [
    momentJsFilePath,
  ]
}
