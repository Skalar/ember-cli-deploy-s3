/* jshint node: true */

var RSVP  = require('rsvp');
var chalk = require('chalk');
var AWS   = require('aws-sdk');

var websiteRegions = require('../s3-website-regions');

module.exports = function(hostedZoneId) {
  var self = this;

  return new RSVP.Promise(function(resolve, reject) {
    self.ui.startProgress(
      chalk.green('Configuring Route 53 record set'), chalk.green('.')
    );

    var regionInfo = websiteRegions[self.options.region];
    var route53    = new AWS.Route53();

    var params = {
      ChangeBatch: {
        Changes: [
          {
            Action: 'UPSERT',
            ResourceRecordSet: {
              Name: self.bucketName,
              Type: 'A',
              AliasTarget: {
                DNSName: regionInfo.websiteEndpoint,
                EvaluateTargetHealth: false,
                HostedZoneId: regionInfo.hostedZoneId
              }
            }
          }
        ]
      },
      HostedZoneId: hostedZoneId
    };

    route53.changeResourceRecordSets(params, function(err, data) {
      self.ui.stopProgress();

      if (err) { return reject(err); }

      self.ok('Route 53 record set configured.');
      resolve(data);
    });

  });
};
