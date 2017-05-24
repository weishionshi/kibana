/**
 * @name es
 *
 * @description This is the result of calling esFactory. esFactory is exposed by the
 * elasticsearch.angular.js client.
 */

import 'elasticsearch-browser';
import _ from 'lodash';
import uiModules from 'ui/modules';

const plugins = [function (Client, config) {
  // esFactory automatically injects the AngularConnector to the config
  // https://github.com/elastic/elasticsearch-js/blob/master/src/lib/connectors/angular.js
  class CustomAngularConnector extends config.connectionClass { // es6中引入了class，
    request = _.wrap(this.request, function (request, params, cb) {	//_.wrap(),相当于
      if (String(params.method).toUpperCase() === 'GET') {
        params.query = _.defaults({ _: Date.now() }, params.query);	// 相当于在params.query前添加一个属性  _ : 当前时间
      }

      return request.call(this, params, cb);
    });
  }

  config.connectionClass = CustomAngularConnector;
}];

uiModules
  .get('kibana', ['elasticsearch', 'kibana/config'])

  //Elasticsearch client used for requesting data.  Connects to the /elasticsearch proxy,
  //Uses a tribe node if configured, otherwise uses the base elasticsearch configuration
  .service('es', function (esFactory, esUrl, esApiVersion, esRequestTimeout) {
    return esFactory({
      host: esUrl,
      log: 'info',
      requestTimeout: esRequestTimeout,
      apiVersion: esApiVersion,
      plugins
    });
  })

  //Elasticsearch client used for managing Kibana's state.  Connects to the /es-admin proxy,
  //Always uses the base elasticsearch configuartion
  .service('esAdmin', function (esFactory, esAdminUrl, esApiVersion, esRequestTimeout) {
    return esFactory({
      host: esAdminUrl,
      log: 'info',
      requestTimeout: esRequestTimeout,
      apiVersion: esApiVersion,
      plugins
    });
  });
