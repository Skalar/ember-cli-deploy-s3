/* jshint node: true */

var RSVP        = require('rsvp');
var chalk       = require('chalk');
var AWS         = require('aws-sdk');
var http        = require('http');
var https       = require('https');
var S3          = require('s3');
var ProgressBar = require('progress');


module.exports = function() {
  var self = this;

  http.globalAgent.maxSockets =
  https.globalAgent.maxSockets = 20;

  return new RSVP.Promise(function(resolve, reject) {
    var s3 = new AWS.S3({ region: self.options.region });
    var client = S3.createClient({ s3Client: s3, maxAsyncS3: 10 });

    var progressFormat =
      chalk.green('Syncing files to bucket') +
      '  :bar  ' + chalk.white(':percent ');

    var progress = new ProgressBar(
      progressFormat,
      {
        clear: true,
        complete: chalk.yellow('█'),
        incomplete: chalk.grey('█'),
        total: 20
      }
    );

    var uploader = client.uploadDir({
      localDir: self.options.outputPath,
      deleteRemoved: self.options.deleteRemoved,
      s3Params: {
        Bucket: self.bucketName,
        ACL: 'public-read'
      }
    });

    uploader.on('error', function(err) {
      reject(err);
    });

    uploader.on('progress', function() {
      if (uploader.doneFindingFiles && uploader.doneFindingObjects) {
        var progressRatio = 0.0;

        if (uploader.progressTotal && uploader.progressMd5Total) {
          progressRatio += uploader.progressAmount / uploader.progressTotal * 0.8;
          progressRatio += uploader.progressMd5Amount / uploader.progressMd5Total * 0.2;
        }

        progressRatio -= 0.01;

        progress.update(progressRatio);
      }
    });

    uploader.on('end', function() {
      progress.terminate();
      self.ok('Files synced to bucket.');

      resolve();
    });
  });
};
