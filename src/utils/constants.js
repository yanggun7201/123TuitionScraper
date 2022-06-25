const path = require("path");

const DAY_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const DOLLAR_PER_MODULE = 0.5;
const DEFAULT_ALLOWANCE = 10;
const SUCCESS_BONUS = 15;

const SUBJECT_SELECT_SELECTOR = "#applicationId";
const STUDENT_SELECT_SELECTOR = "#studentId";
const COURSE_SELECT_SELECTOR = "#curriculumId";
const BASE_URL = "https://learning.123tuition.co.nz/";

const momentJsFilePath = path.join(global.ROOT_DIR, "/lib/moment/moment.min.js");
// const kakaoFullSDKFilePath = path.join(global.ROOT_DIR, "/lib/kakao/kakao.1.42.0.min.js");
const KAKAO_FULL_SDK_JS_PATH = "https://developers.kakao.com/sdk/js/kakao.js";

module.exports = {
  BASE_URL,
  SUBJECT_SELECT_SELECTOR,
  STUDENT_SELECT_SELECTOR,
  COURSE_SELECT_SELECTOR,
  KAKAO_FULL_SDK_JS_PATH,
  DOLLAR_PER_MODULE,
  DEFAULT_ALLOWANCE,
  DAY_OF_WEEK,
  SUCCESS_BONUS,
  JS_FILE_PATHS: [
    momentJsFilePath,
    // kakaoFullSDKFilePath,
  ]
}
