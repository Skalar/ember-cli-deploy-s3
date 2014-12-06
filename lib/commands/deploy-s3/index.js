/* jshint node: true */

var path  = require('path');
var chalk = require('chalk');

module.exports = {
  name: 'deploy-s3',

  description:
    'Deploys app to S3 bucket. Creates and configures specified bucket.',

  availableOptions: [
    { name: 'build', type: Boolean, default: true },
    { name: 'environment', type: String, default: 'production' },
    { name: 'output-path', type: path, default: 'dist/' },
    {
      name: 'region',
      type: String,
      default: process.env.AWS_REGION ||
      process.env.AWS_DEFAULT_REGION ||
      'eu-west-1',
    },
    { name: 'route53', type: Boolean },
    { name: 'route53-domain', type: String },
    { name: 'force-bucket-config', type: Boolean },
    { name: 'delete-removed', type: Boolean }
  ],

  aliases             : ['s3'],
  anonymousOptions    : ['<s3-bucket>'],

  run                 : require('./run'),

  checkIfBucketExists : require('../../helpers/check-if-bucket-exists'),
  createBucket        : require('../../helpers/create-bucket'),
  configureBucket     : require('../../helpers/configure-bucket'),
  syncFilesToBucket   : require('../../helpers/sync-files-to-bucket'),
  getBucketRegion     : require('../../helpers/get-bucket-region'),
  findRoute53Zone     : require('../../helpers/find-route53-zone'),
  configureRecordSet  : require('../../helpers/configure-record-set'),
  createHostedZone    : require('../../helpers/create-hosted-zone'),

  // Helper functions for CLI output
  info: function(message) {
    this.ui.writeLine(chalk.grey(' ℹ  ' + message), 'INFO');
  },

  ok: function(message) {
    this.ui.writeLine(chalk.green(' ✔  ') + message, 'INFO');
  },

  warn: function(message) {
    this.ui.writeLine(chalk.yellow(' ⚠  ' + message), 'WARNING');
  }

};
