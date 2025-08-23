import { registerRootComponent } from 'expo';
import App from './App';

// Web 平台的特殊处理
if (typeof window !== 'undefined') {
  // 创建 Platform polyfill
  const Platform = {
    OS: 'web',
    select: (obj) => obj.web || obj.default || obj.native,
    Version: 1,
    isTesting: false,
    isTV: false,
  };

  // 创建一个简单的模块解析器
  const originalRequire = window.require;
  
  // 重写模块解析
  const moduleShims = {
    '../Utilities/Platform': Platform,
    '../Utilities/codegenNativeComponent': () => {
      const React = require('react');
      return React.forwardRef((props, ref) => {
        return React.createElement('div', { ...props, ref });
      });
    },
    '../Utilities/RCTEventEmitter': class MockEventEmitter {
      addListener() { return { remove: () => {} }; }
      removeListener() {}
      emit() {}
    },
  };

  // 如果有全局 require，则重写它
  if (typeof window.require === 'function') {
    const originalRequire = window.require;
    window.require = function(moduleName) {
      if (moduleShims[moduleName]) {
        return moduleShims[moduleName];
      }
      try {
        return originalRequire.apply(this, arguments);
      } catch (e) {
        console.warn('Failed to require module:', moduleName, e);
        return {};
      }
    };
  }
}

registerRootComponent(App);
