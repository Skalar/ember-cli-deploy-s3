/* jshint node: true */

var RSVP  = require('rsvp');
var chalk = require('chalk');
var AWS   = require('aws-sdk');

module.exports = function() {
  var self = this;

  self.ui.startProgress(
    chalk.green('Configuring bucket'), chalk.green('.')
  );

  var s3 = new AWS.S3({ region: self.options.region });

  var params = {
    Bucket: self.bucketName,
    WebsiteConfiguration: {
      IndexDocument: { Suffix: 'index.html' },
      RoutingRules: [
      {
        Redirect: {
          ReplaceKeyPrefixWith: '#/',
        },
        Condition: {
          HttpErrorCodeReturnedEquals: '404'
        }
      },
      ]
    }
  };

  return new RSVP.Promise(function(resolve, reject) {

    s3.putBucketWebsite(params, function(err, data) {
      self.ui.stopProgress();

      if (err) { return reject(err); }

      self.ok('Bucket configured as website.');

      resolve(data);
    });

  });
};
