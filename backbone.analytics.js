(function(factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['backbone'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('backbone'));
  } else {
    factory(window.Backbone);
  }
})(function(Backbone) {

  'use strict';

  var loadUrl = Backbone.History.prototype.loadUrl;

  Backbone.Analytics = {
	  getTracker: function() {
		  // Universal Analytics
		  var ga;
		  if (window.GoogleAnalyticsObject && window.GoogleAnalyticsObject !== 'ga') {
			  ga = window.GoogleAnalyticsObject;
		  } else {
			  ga = window.ga;
		  }
		  return ga || function(){};
	  },

	  setVar: function(dimension, value) {
		var ga = this.getTracker();
		if(ga)
			ga('set', dimension, value);
	  }
  };

  Backbone.History.prototype.loadUrl = function(fragmentOverride) {
    var matched = loadUrl.apply(this, arguments),
        gaFragment = this.fragment;

    if (!this.options.silent) {
      this.options.silent = true;
      return matched;
    }
    
    if (!/^\//.test(gaFragment)) {
      gaFragment = '/' + gaFragment;
    }

    // legacy version
    if (typeof window._gaq !== "undefined") {
      window._gaq.push(['_trackPageview', gaFragment]);
    }

    // Analytics.js
    var ga;
    if (window.GoogleAnalyticsObject && window.GoogleAnalyticsObject !== 'ga') {
      ga = window.GoogleAnalyticsObject;
    } else {
      ga = window.ga;
    }

	Backbone.Analytics.getTracker()('send', 'pageview', gaFragment);

    return matched;
  };

});
