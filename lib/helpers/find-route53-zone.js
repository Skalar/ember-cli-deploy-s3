/* jshint node: true */

var RSVP  = require('rsvp');
var chalk = require('chalk');
var AWS   = require('aws-sdk');

module.exports = function() {
  var self = this;

  self.ui.startProgress(
    chalk.green('Trying to find Route 53 hosted zone'),
    chalk.green('.')
  );

  var route53 = new AWS.Route53();

  return new RSVP.Promise(function(resolve, reject) {

    var candidate      = null,
        candidateScore = 0;

    var bucketComponents = self.bucketName.split('.').reverse();

    var getZoneCandidates = function(marker) {
      route53.listHostedZones(
        { MaxItems: '100', Marker: marker },

        function(err, data) {
          if (err) { return reject(err); }

          data.HostedZones.forEach(function(hostedZone) {

            // Check if this zone is a more specific candidate
            var domain = hostedZone.Name.slice(0, -1);
            var domainComponents = domain.split('.').reverse();

            for (var i = 0; i < bucketComponents.length; i++) {
              if (bucketComponents[i] !== domainComponents[i]) {
                break;
              }
              if (i > candidateScore && i === domainComponents.length - 1) {
                candidate = hostedZone;
                candidateScore = i;
              }
            }
          });

          if (data.IsTruncated) {
            return getZoneCandidates(data.NextMarker);
          }

          self.ui.stopProgress();

          if (candidate) {
            self.info('Found Route 53 hosted zone ' + chalk.bold(candidate.Name) + ' ' + candidate.Id);
            return resolve(candidate);
          }

          self.info('No compatible existing Route 53 zone found.');
          resolve();
        }
      );
    };

    getZoneCandidates();

  });
};
