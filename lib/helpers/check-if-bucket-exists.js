/* jshint node: true */

var RSVP  = require('rsvp');
var chalk = require('chalk');
var AWS   = require('aws-sdk');

module.exports = function() {
  var self = this;

  self.ui.startProgress(
    chalk.green('Checking if bucket exists and you have permission'),
    chalk.green('.')
  );

  var s3 = new AWS.S3({ region: self.options.region });

  return new RSVP.Promise(function(resolve, reject) {

    s3.headBucket(
      { Bucket: self.bucketName },

      function(err) {
        self.ui.stopProgress();

        if (!err) {
          self.info('Bucket already exists.');
          return resolve(true);
        }

        if (err.code === 'NotFound') {
          self.info('Bucket does not exists.');
          resolve(false);
        }
        else if (err.code === 'Forbidden') {
          reject(
            new Error('You do not have access to the bucket')
          );
        }
        else { reject(err); }
      }
    );

  });
};
