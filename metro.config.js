const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 为 Web 平台添加特殊处理
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// 添加解析器配置
config.resolver.alias = {
  ...config.resolver.alias,
  // 解决 React Native Web 兼容性问题
  '../Utilities/Platform': require.resolve('react-native-web/dist/exports/Platform'),
};

// 添加模块映射
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// 为 Web 平台禁用一些有问题的模块
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.alias = {
    ...config.resolver.alias,
    '../Utilities/Platform': require.resolve('react-native-web/dist/exports/Platform'),
    '../Utilities/codegenNativeComponent': require.resolve('react-native-web/dist/exports/View'),
  };
}

module.exports = config;
