// autoloading

// preloading (for faster webpack builds)
import moment from 'moment-timezone';
import chrome from 'ui/chrome';
import routes from 'ui/routes';
import modules from 'ui/modules';

import kibanaLogoUrl from 'ui/images/kibana.svg';
import 'ui/autoload/all';
import 'plugins/kibana/discover/index';
import 'plugins/kibana/visualize/index';
import 'plugins/kibana/dashboard/index';
import 'plugins/kibana/management/index';
import 'plugins/kibana/doc';
import 'plugins/kibana/dev_tools';
import 'ui/vislib';
import 'ui/agg_response';
import 'ui/agg_types';
import 'ui/timepicker';
import Notifier from 'ui/notify/notifier';
import 'leaflet';

routes.enable();

routes
.otherwise({
  redirectTo: `/${chrome.getInjected('kbnDefaultAppId', 'discover')}`
});

chrome
.setRootController('kibana', function ($scope, courier, config) {
  // wait for the application to finish loading
  // 控制器监听 application.load 事件，在页面加载完成的时候，触发 courier.start() 函数
  //Courier 是一个非常重要的类，可以简单理解为 kibana 跟 ES 之间的一个 object mapper
  $scope.$on('application.load', function () {
    courier.start();  //src/ui/public/courier/courier.js
  });

  config.watch('dateFormat:tz', setDefaultTimezone, $scope);
  config.watch('dateFormat:dow', setStartDayOfWeek, $scope);

  function setDefaultTimezone(tz) {
    moment.tz.setDefault(tz);
  }

  function setStartDayOfWeek(day) {
    const dow = moment.weekdays().indexOf(day);
    moment.updateLocale(moment.locale(), { week: { dow } });
  }
});

modules.get('kibana').run(Notifier.pullMessageFromUrl);
