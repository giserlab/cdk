// @ts-check

/** @type {import("@commitlint/types").UserConfig} */
export default {
  ignores: [commit => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'perf', // 性能优化
        'style', // 代码格式
        'docs', // 文档
        'test', // 测试
        'refactor', // 重构
        'build', // 打包
        'chore', // 构建项目及其他
        'revert', // 回滚
        'workflow', // 工作流
        'release', // 发布
        'demo', // 示例相关
      ],
    ],
  },
};
