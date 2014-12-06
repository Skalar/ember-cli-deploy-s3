/* jshint node: true */

var RSVP  = require('rsvp');
var chalk = require('chalk');

var s3WebsiteRegions = require('../../s3-website-regions');

module.exports = function (options, args) {
  var self = this;

  self.bucketName = args[0];
  self.options    = options;

  if (!self.bucketName) {
    return RSVP.Promise.reject(
      new Error('You need to provide a bucket name')
    );
  }

  self.info('AWS Region: ' + chalk.white(options.region));
  self.info('Bucket: ' + chalk.white(self.bucketName));


  return new RSVP.Promise(function(resolve, reject) {
    // Check if the bucket exists and we have permission
    self.checkIfBucketExists()

    // Create bucket if needed
    .then(function(bucketExists) {
      if (bucketExists) {
        return new RSVP.Promise(function(resolve, reject) {
          self.getBucketRegion()
          .then(function(region) {
            // Update region in case its different than what was specified
            self.options.region = region;
            resolve(false);
          })
          .catch(reject);
        });
      }
      else {
        return self.createBucket();
      }
    })

    // Configure S3 bucket
    .then(function (bucketWasCreated) {
      if (bucketWasCreated || options.forceBucketConfig) {
        return self.configureBucket();
      }
    })

    // Setup Route53
    .then(function() {
      if (options.route53) {
        return new RSVP.Promise(function(resolve, reject) {

          self.findRoute53Zone().then(function(existingZone) {
            var gotZone = existingZone ? RSVP.resolve(existingZone)
                                       : self.createHostedZone();

            gotZone.then(function(zone) {
              self.configureRecordSet(zone.Id).then(resolve);
            }, reject);
          });

        });
      }
    })

    // Build Ember app
    .then(function () {
      if (!options.build) { return RSVP.resolve(); }

        var buildTask = new self.tasks.Build({
          ui        : self.ui,
          analytics : self.analytics,
          project   : self.project
        });

        return buildTask.run(options);
      })

    // Sync files to S3 bucket
    .then(function() {
      return self.syncFilesToBucket();
    })

    .then(function() {
      var endpoint = s3WebsiteRegions[self.options.region].websiteEndpoint;
      var bucketNameParts = self.bucketName.split('.');

      var s3Url     = 'http://' + self.bucketName + '.' + endpoint;
      var customUrl = 'http://' + self.bucketName;

      var hl = chalk.white;

      self.ui.writeLine('');
      self.info('S3 url:     ' + hl(s3Url));

      if (bucketNameParts.length > 1) {
        self.info('Custom url: ' + hl(customUrl));
      }

      self.ui.writeLine('');
    })

    .then(resolve)
    .catch(reject);
  });
};
