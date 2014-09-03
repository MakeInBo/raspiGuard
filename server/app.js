
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , DBlite = require('./accessDBlite').AccessDBlite
  , protectJSON = require('./lib/protectJSON');

var app = module.exports = express();

var DBlite = require('./accessDBlite');
var nodeUserGid = 'pi';
var nodeUserUid = 'pi';


// Configuration

app.configure(function(){
  app.use(protectJSON);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser()); //*
  app.use(express.session({ secret: 'gopalapuram' })); //*
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/../'));
  app.use(app.router);
});

var connLite = '/home/pi/rpiguard/rpiguard.db';
var dblite;
dblite = new DBlite.startup(connLite);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

function csrf(req, res, next) {
  res.locals.token = req.session._csrf;
  next();
}

// Routes

app.get('/', routes.index);

// JSON API

app.get     ('/api/dataservice/zones'       , api.zones);
app.get     ('/api/dataservice/zones/:id'   , api.zone);
app.post    ('/api/dataservice/zones'       , api.addZone);
app.put     ('/api/dataservice/zones/:id'   , api.editZone);
app.delete  ('/api/dataservice/zones/:id'   , api.deleteZone);

app.get     ('/api/dataservice/devices'       , api.devices);
app.get     ('/api/dataservice/devices/:id'   , api.device);
app.post    ('/api/dataservice/devices'       , api.addDevice);
app.put     ('/api/dataservice/devices/:id'   , api.editDevice);
app.delete  ('/api/dataservice/devices/:id'   , api.deleteDevice);

app.get     ('/api/dataservice/params'       , api.params);
app.get     ('/api/dataservice/params/:id'   , api.param);
app.post    ('/api/dataservice/params'       , api.addParam);
app.put     ('/api/dataservice/params/:id'   , api.editParam);
app.delete  ('/api/dataservice/params/:id'   , api.deleteParam);

app.get     ('/api/dataservice/events'       , api.events);
app.get     ('/api/dataservice/events/:id'   , api.event);
app.post    ('/api/dataservice/events'       , api.addEvent);
app.put     ('/api/dataservice/events/:id'   , api.editEvent);
app.delete  ('/api/dataservice/events/:id'   , api.deleteEvent);



// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(80, function(){
  process.setgid (nodeUserGid);
  process.setuid (nodeUserUid);
  console.log("raspiGuard Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
