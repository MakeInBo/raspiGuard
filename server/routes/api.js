var dblite = require('../accessDBlite')
  , util = require('util');

// ------------- raspiGuard zones
// GET
exports.zones = function (req, res) {
  //  console.log('*** zones');

  dblite.getZones(req.query, function(err, zones) {
    if (err) {
      console.log('*** zones err');
      res.json({
        zones: zones
      });
    } else {
      //  console.log('*** zones ok');
        var start = req.query.$$skip +1;
        (req.query.$$top > 0) ? stop = req.query.$$skip+ req.query.$$top : stop = req.query.$$count;
        res.set('Db-Content-Range', start+'-'+stop+'/'+req.query.$$count);
        res.json(zones);
    }
  });
};

exports.zone = function (req, res) {
  //  console.log('*** zone');

  dblite.getZone(req.params.id, function(err, zone) {
    if (err) {
      console.log('*** zone err' + util.inspect(err));
      res.json({
        zone: zone
      });
    } else {
      //  console.log('*** zone ok');

      res.json(zone);
    }
  });
};

exports.addZone = function (req, res) {
    //  console.log('*** addZone');
    dblite.insertZone(req.body, function(err,zone){
        if (err) {
          console.log('*** addZone err' + util.inspect(err));
          res.json({'status': false});
        } else {
          //  console.log('*** addZone ok');
          res.json(zone);
        }
    });
};

 exports.editZone = function (req, res) {
    //  console.log('*** editZone');
    dblite.editZone(req.params.id, req.body, function(err,zone) {
        if (err) {
          console.log('*** editZone err' + util.inspect(err));
          res.json({'status': false});
        } else {
          //  console.log('*** editZone ok');
          res.json(zone);
        }
    });
};

exports.deleteZone = function (req, res) {
  //  console.log('*** deleteZone');

  dblite.deleteZone(req.params.id, function(err) {
    if (err) {
      console.log('*** deleteZone err' + util.inspect(err));
      res.json({'status': false});
    } else {
      //  console.log('*** deleteZone ok');
      res.json({'status': true});
    }
  });
};

// ------------- raspiGuard devices
// GET
exports.devices = function (req, res) {
  //  console.log('*** devices');

  dblite.getDevices(req.query, function(err, devices) {
    if (err) {
      console.log('*** devices err');
      res.json({
        devices: devices
      });
    } else {
      //  console.log('*** devices ok');
        var start = req.query.$$skip +1;
        (req.query.$$top > 0) ? stop = req.query.$$skip+ req.query.$$top : stop = req.query.$$count;
        res.set('Db-Content-Range', start+'-'+stop+'/'+req.query.$$count);

        res.json(devices);
    }
  });
};

exports.device = function (req, res) {
  //  console.log('*** device');

  dblite.getDevice(req.params.id, function(err, device) {
    if (err) {
      console.log('*** device err' + util.inspect(err));
      res.json({
        device: device
      });
    } else {
      //  console.log('*** device ok');

      res.json(device);
    }
  });
};

exports.addDevice = function (req, res) {
    //  console.log('*** addDevice');
    dblite.insertDevice(req.body, function(err,device){
        if (err) {
          console.log('*** addDevice err' + util.inspect(err));
          res.json({'status': false});
        } else {
          //  console.log('*** addDevice ok');
          res.json(device);
        }
    });
};

 exports.editDevice = function (req, res) {
    //  console.log('*** editDevice');
    dblite.editDevice(req.params.id, req.body, function(err,device) {
        if (err) {
          console.log('*** editDevice err' + util.inspect(err));
          res.json({'status': false});
        } else {
          //  console.log('*** editDevice ok');
          res.json(device);
        }
    });
};

exports.deleteDevice = function (req, res) {
  //  console.log('*** deleteDevice');

  dblite.deleteDevice(req.params.id, function(err) {
    if (err) {
      console.log('*** deleteDevice err' + util.inspect(err));
      res.json({'status': false});
    } else {
      //  console.log('*** deleteDevice ok');
      res.json({'status': true});
    }
  });
};

// ------------- raspiGuard params
// GET
exports.params = function (req, res) {
  //  console.log('*** params');

  dblite.getParams(req.query, function(err, params) {
    if (err) {
      console.log('*** params err');
      res.json({
        params: params
      });
    } else {
      //  console.log('*** params ok');
        var start = req.query.$$skip +1;
        (req.query.$$top > 0) ? stop = req.query.$$skip+ req.query.$$top : stop = req.query.$$count;
        res.set('Db-Content-Range', start+'-'+stop+'/'+req.query.$$count);
        res.json(params);
    }
  });
};

exports.param = function (req, res) {
  //  console.log('*** param');

  dblite.getParam(req.params.id, function(err, param) {
    if (err) {
      console.log('*** param err' + util.inspect(err));
      res.json({
        param: param
      });
    } else {
      //  console.log('*** param ok');

      res.json(param);
    }
  });
};

exports.addParam = function (req, res) {
    //  console.log('*** addParam');
    dblite.insertParam(req.body, function(err,param){
        if (err) {
          console.log('*** addParam err' + util.inspect(err));
          res.json({'status': false});
        } else {
          //  console.log('*** addParam ok');
          res.json(param);
        }
    });
};

 exports.editParam = function (req, res) {
    //  console.log('*** editParam');
    dblite.editParam(req.params.id, req.body, function(err,param) {
        if (err) {
          console.log('*** editParam err' + util.inspect(err));
          res.json({'status': false});
        } else {
          //  console.log('*** editParam ok');
          res.json(param);
        }
    });
};

exports.deleteParam = function (req, res) {
  //  console.log('*** deleteParam');

  dblite.deleteParam(req.params.id, function(err) {
    if (err) {
      console.log('*** deleteParam err' + util.inspect(err));
      res.json({'status': false});
    } else {
      //  console.log('*** deleteParam ok');
      res.json({'status': true});
    }
  });
};

// ------------- raspiGuard events
// GET
exports.events = function (req, res) {
  //  console.log('*** events');

  dblite.getEvents(req.query, function(err, events) {
    if (err) {
      console.log('*** events err');
      res.json({
        events: events
      });
    } else {
      //  console.log('*** events ok');
        var start = req.query.$$skip +1;
        (req.query.$$top > 0) ? stop = req.query.$$skip+ req.query.$$top : stop = req.query.$$count;
        res.set('Db-Content-Range', start+'-'+stop+'/'+req.query.$$count);
        res.json(events);
    }
  });
};

exports.event = function (req, res) {
  //  console.log('*** event');

  dblite.getEvent(req.params.id, function(err, event) {
    if (err) {
      console.log('*** event err' + util.inspect(err));
      res.json({
        event: event
      });
    } else {
      //  console.log('*** event ok');

      res.json(event);
    }
  });
};

exports.addEvent = function (req, res) {
    //  console.log('*** addEvent');
    dblite.insertEvent(req.body, function(err,event){
        if (err) {
          console.log('*** addEvent err' + util.inspect(err));
          res.json({'status': false});
        } else {
          //  console.log('*** addEvent ok');
          res.json(event);
        }
    });
};

 exports.editEvent = function (req, res) {
    //  console.log('*** editEvent');
    dblite.editEvent(req.params.id, req.body, function(err,event) {
        if (err) {
          console.log('*** editEvent err' + util.inspect(err));
          res.json({'status': false});
        } else {
          //  console.log('*** editEvent ok');
          res.json(event);
        }
    });
};

exports.deleteEvent = function (req, res) {
  //  console.log('*** deleteEvent');

  dblite.deleteEvent(req.params.id, function(err) {
    if (err) {
      console.log('*** deleteEvent err' + util.inspect(err));
      res.json({'status': false});
    } else {
      //  console.log('*** deleteEvent ok');
      res.json({'status': true});
    }
  });
};

