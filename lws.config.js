module.exports = {
  port: 4200,
  key: 'ssl/cert.key',
  cert: 'ssl/cert.crt',
  https: true,
  rewrite: [
    {
      from: '/api/access/(.*)',
      to: 'http://localhost:7001/api/access/$1'
    },
    {
      from: '/api/forms/(.*)',
      to: 'http://localhost:7002/api/forms/$1'
    },
    {
      from: '/api/notifications(.*)',
      to: 'http://localhost:7003/api/notifications$1'
    }
  ],
  directory: 'dist/qeeps-ui',
  logFormat: 'stats'
}
