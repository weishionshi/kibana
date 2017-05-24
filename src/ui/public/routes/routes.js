import RouteManager from './route_manager';
import 'angular-route/angular-route';
import uiModules from 'ui/modules';
let defaultRouteManager = new RouteManager();

module.exports = {
  ...defaultRouteManager,//...运算符，作用是将数组 转换成 逐个的 函数入参 
  enable() {
    uiModules
    .get('kibana', ['ngRoute'])
    .config(defaultRouteManager.config);
  }
};
