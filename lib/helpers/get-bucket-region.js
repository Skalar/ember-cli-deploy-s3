/* jshint node: true */

var RSVP  = require('rsvp');
var chalk = require('chalk');
var AWS   = require('aws-sdk');

module.exports = function() {
  var self = this;

  self.ui.startProgress(
    chalk.green('Getting existing bucket region'),
    chalk.green('.')
  );

  var s3 = new AWS.S3({ region: self.options.region });

  return new RSVP.Promise(function(resolve, reject) {

    s3.getBucketLocation(
      { Bucket: self.bucketName },
      function(err, data) {
        self.ui.stopProgress();

        if (err) { return reject(err); }
        resolve(data.LocationConstraint);
      }
    );

  });
};
