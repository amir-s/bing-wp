module.exports = {
  apps: [
    {
      name: 'hellp-data',
      script: 'index.js',

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'hello-data',
      host: 'node-server.amirs.dev',
      ref: 'origin/master',
      repo: 'https://github.com/amir-s/hello-data.git',
      path: '/home/hello-data/hello-data-deploy',
      'post-deploy': 'npm install && npm run production',
    },
  },
};
