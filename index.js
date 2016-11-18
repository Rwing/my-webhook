var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/webhook', secret: 'myhashsecret' })
var git = require('simple-git');

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  var workingDirs = {
    'Rwing/koajs.com': '/var/www/koajs.com'
  };
  if (workingDirs[event.payload.repository.full_name]) {
    git(workingDirs[event.payload.repository.full_name])
      .pull(function (err, update) {
        if (update && update.summary.changes) {
          //require('child_process').exec('npm restart');
        }
      });
    console.log('Received a push event for %s to %s',
      event.payload.repository.name,
      event.payload.ref)
  }
})

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})