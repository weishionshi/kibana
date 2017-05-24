import _ from 'lodash';
import reqRespStatsHTML from 'plugins/spy_modes/req_resp_stats_spy_mode.html';

const linkReqRespStats = function ($scope, config) {
  $scope.$bind('req', 'searchSource.history[searchSource.history.length - 1]');
  $scope.$watchMulti([
    'req',
    'req.started',
    'req.stopped',
    'searchSource'
  ], function () {
    if (!$scope.searchSource || !$scope.req) return;

    const req = $scope.req;
    const resp = $scope.req.resp;
    const stats = $scope.stats = [];

    if (resp && resp.took != null) stats.push(['查询耗时', resp.took + 'ms']);//Query Duration
    if (req && req.ms != null) stats.push(['请求耗时', req.ms + 'ms']); //Request Duration
    if (resp && resp.hits) stats.push(['匹配次数', resp.hits.total]);  //Hits

    if (req.fetchParams) {
      if (req.fetchParams.index) stats.push(['Index', req.fetchParams.index]);
      if (req.fetchParams.type) stats.push(['Type', req.fetchParams.type]);
      if (req.fetchParams.id) stats.push(['Id', req.fetchParams.id]);
    }
  });
};

require('ui/registry/spy_modes')
.register(function () {
  return {
    name: 'request',
    display: '请求内容',//Request
    order: 2,
    template: reqRespStatsHTML,
    link: linkReqRespStats
  };
})
.register(function () {
  return {
    name: 'response',
    display: '响应内容', //Response
    order: 3,
    template: reqRespStatsHTML,
    link: linkReqRespStats
  };
})
.register(function () {
  return {
    name: 'stats',
    display: '统计信息',//Statistics
    order: 4,
    template: reqRespStatsHTML,
    link: linkReqRespStats
  };
});
