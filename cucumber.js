// cucumber.js
module.exports = {
  default: {
    require: ['features/step_definitions/*.js'],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    timeout: 60000,
    paths: ['features/']
  }
};