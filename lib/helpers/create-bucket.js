/* jshint node: true */

var RSVP  = require('rsvp');
var chalk = require('chalk');
var AWS   = require('aws-sdk');

module.exports = function() {
  var self = this;

  return new RSVP.Promise(function(resolve, reject) {
    self.ui.startProgress(
      chalk.green('Creating s3 bucket'), chalk.green('.')
    );

    var s3 = new AWS.S3({ region: self.options.region });

    var bucketParams = {
      Bucket: self.bucketName,
      ACL: 'public-read'
    };

    if (self.options.region) {
      bucketParams.CreateBucketConfiguration = {
        LocationConstraint: self.options.region
      };
    }

    s3.createBucket(
      bucketParams,
      function(err, data) {
        self.ui.stopProgress();

        if (err) { return reject(err); }
        self.ok('S3 bucket created.');
        resolve(data);
      }
    );

  });

};
