/* jshint node: true */

var RSVP  = require('rsvp');
var chalk = require('chalk');
var AWS   = require('aws-sdk');

module.exports = function() {
  var self = this;

  return new RSVP.Promise(function(resolve, reject) {
    self.ui.startProgress(
      chalk.green('Creating Route 53 hosted zone'), chalk.green('.')
    );

    var route53 = new AWS.Route53();
    var inferredDomain = self.bucketName.split('.').splice(1).join('.');

    var params = {
      CallerReference  : 'ember-cli-' + new Date().getTime(),
      Name             : self.options.route53Domain || inferredDomain,
      HostedZoneConfig : {
        Comment        : 'Created by ember-cli-deploy-s3'
      }
    };

    route53.createHostedZone(params, function(err, data) {
      self.ui.stopProgress();

      if (err) { return reject(err); }
      self.ok('Route 53 hosted zone created (' + chalk.white.bold(params.Name) + ').');
      self.warn('You have to setup the following NS records for ' + self.bucketName + ':')

      data.DelegationSet.NameServers.forEach(function(ns) {
        self.ui.writeLine('      * ' + chalk.white(ns));
      });

      resolve(data.HostedZone);
    });

  });
};
