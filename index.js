/* jshint node: true */

'use strict';

module.exports = {

  name: 'deploy-s3',

  includedCommands: function () {
    return {
      'deploy-s3': require('./lib/commands/deploy-s3')
    };
  }

};
