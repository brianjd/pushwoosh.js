var Q = require('q'),
    _ = require('lodash'),
    chalk = require('chalk'),
    Client = require('node-rest-client').Client,
    baseApiUrl = "https://cp.pushwoosh.com/json/1.3/";

/**
 *   PushWoosh.js
 */

var PushWoosh = function (options) {

  var _this = this;

  this.client = new Client();
  this.options = options || {};

  var apiMethods = ['createMessage', 'deleteMessage', 'registerDevice', 'unregisterDevice', 'setTags', 'getTags', 'setBadge','pushStat', 'getNearestZone'];

  _.each(apiMethods, function (method) {

    _this.client.registerMethod(method, baseApiUrl + method, 'POST');

    _this.[method] = function (o) {

      var defer = Q.defer(),
          req = { headers: { "Content-Type": "application/json" }, data: { request: {} }};

      req.data.request.auth = options.auth || process.env.PW_ACCESS_TOKEN;
      req.data.request.application = options.application || process.env.PW_APPLICATION_CODE;
      req.data.request.application_group = options.application_group || process.env.PW_APPLICATION_GROUP;

      _.extend(req.data.request, o); o = undefined;

      if (req.data.request.applications_group === undefined)
        delete req.data.request.application_group || delete req.data.request.application;

      if ('getTags' === method)
        delete req.data.request.application_group;

      if ('deleteMessage' === method)
        delete req.data.request.application && delete req.data.request.application_group;

      if (['registerDevice', 'unregisterDevice', 'setTags', 'setBadge', 'pushStat', 'getNearestZone'].indexOf(method) > -1)
        delete req.data.request.auth && delete req.data.request.appication_group;

      _this.client.methods[method](req, function (data, res) {

        var data = JSON.parse(data);

        // TODO: include sanitized request object in error output

        if (200 !== res.statusCode) {
          console.log(chalk.red(chalk.blue.bold('PushWoosh') + ' [/' + method + '] ==> [ERROR] ' + res.statusCode));
          return defer.reject();
        } else

        if ([res.statusCode, parseInt(data.status_code)].indexOf(210) > -1) {
          console.log(chalk.red('PushWoosh [/' + method + '] ==> [ERROR] 210 | ' + data.status_message));
          return defer.reject();
        }

        console.log(chalk.green('PushWoosh [/'+ method + '] ==> [OK] 200'));
        defer.resolve(data);

      });

      return defer.promise;

    }

  });

  return _this;

}

module.exports = PushWoosh;
