// Mock global de mermaid — empêche les unhandled promise rejections
// Doit être chargé AVANT mermaid.min.js pour empêcher son initialisation

Object.defineProperty(window, 'mermaid', {
  value: {
    initialize: function() {},
    run: function() { return Promise.resolve(); },
    render: function() { return Promise.resolve({ svg: '' }); },
    parse: function() {},
    mermaidAPI: {
      initialize: function() {},
      getConfig: function() { return {}; },
      setConfig: function() {},
      getSiteConfig: function() { return {}; },
      updateSiteConfig: function() {},
      reset: function() {},
      globalReset: function() {},
      defaultConfig: {},
    },
  },
  writable: false,
  configurable: true,
});
