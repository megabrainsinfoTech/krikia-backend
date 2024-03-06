const UAParser = require("ua-parser-js");
/**
 *
 * @param {object} reqx - This is request object from node
 * @returns {object} {
 * browser,
    browserVersion,
    os,
 * }
 */
module.exports = (reqx) => {
  let parser = new UAParser(reqx);
  let parserResults = parser.getResult();
  return {
    browser: parserResults.browser.name,
    browserVersion: parserResults.browser.version,
    os: parserResults.os.name,
  };
};
