const { verboseLogging } = require('./env');

const verboseLog = verboseLogging ? console.log.bind(console) : function () {};

module.exports = {
    verboseLog: verboseLog,
};
