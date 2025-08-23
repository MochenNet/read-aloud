// Web polyfill for React Native compatibility issues
if (typeof window !== 'undefined') {
  // 为 Web 平台创建 Platform polyfill
  const Platform = {
    OS: 'web',
    select: (obj) => obj.web || obj.default,
    Version: 1,
    isTesting: false,
    isTV: false,
  };

  // 创建模块映射
  const moduleMap = {
    '../Utilities/Platform': Platform,
    '../Utilities/codegenNativeComponent': () => require('react').forwardRef(() => null),
    '../Utilities/RCTEventEmitter': class {
      addListener() {}
      removeListener() {}
      emit() {}
    },
  };

  // 重写 require 函数
  const originalRequire = window.require;
  if (originalRequire) {
    window.require = function(moduleName) {
      if (moduleMap[moduleName]) {
        return moduleMap[moduleName];
      }
      return originalRequire.apply(this, arguments);
    };
  }
}
