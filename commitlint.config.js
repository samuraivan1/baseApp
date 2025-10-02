module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'chore',
        'test',
        'docs',
        'build',
        'ci',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'auth',
        'security',
        'users-query',
        'roles-query',
        'permissions',
        'state',
        'lint',
        'deps',
        'shell',
      ],
    ],
  },
};

