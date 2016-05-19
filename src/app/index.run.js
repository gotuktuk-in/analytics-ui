(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
