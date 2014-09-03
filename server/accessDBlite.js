// Module dependencies
var sqllite = require('dblite');
//  , querystring = require('querystring');


// connect to database
module.exports = {
  // Define class variable
  myEventID: null,

  // initialize DB
  startup: function(dbToUse) {
    dblite = sqllite(dbToUse, '-header');
    dblite.query(
        'PRAGMA foreign_keys = ON',
        function (err, data) {
            if (! err) console.log('We have connected to sqlite');
        }
    );
  },

  // disconnect from database
  closeDB: function() {
    dblite.close();
  },
// -----------------------------------------------------------------------------
  // get all the zones
  getZones: function(query, callback) {
    //  console.log('*** accessDBlite.getZones');
    (typeof query.$skip === 'undefined')  ? query.$$skip = 0 : query.$$skip = parseInt (query.$skip);
    (typeof query.$top  === 'undefined')  ? query.$$top  = 0 : query.$$top  = parseInt (query.$top );
    var sqlc = 'SELECT * FROM zones';
    sqlc += ' ORDER BY zone_id';     
    dblite.query(
        sqlc,
        {
            zone_id : Number,
            zone_parent : Number,
            description : String, 
            position : String,
            enabled : Number,
            action : String,
            status : Number
        },
        function (err, data) {
            if ( !err) {
                query.$$count = data.length;
                if (query.$$skip > 0) {
                    data.splice (0,query.$$skip);
                }
                if (query.$$top > 0) {
                    data.splice (query.$$top,data.length-query.$$top);
                }
            }
            callback(err, data);
        }
    );
  },

  // get a  zone
  getZone: function(id, callback) {
    //  console.log('*** accessDBlite.getZone');
    dblite.query(
        'SELECT * FROM zones WHERE zone_id = :id ',
        {
          id: id
        },
        {
            zone_id : Number,
            zone_parent : Number,
            description : String, 
            position : String,
            enabled : Number,
            action : String,
            status : Number
        },
            function (err, data) {
            callback(err, data[0]);
        }
    );
  },

  // insert a  zone
  insertZone: function(req_body, callback) {
    //  console.log('*** accessDBlite.insertZone');
    var sqlh = "";
    var sqlv = ""; 
    if (typeof req_body.zone_parent !== 'undefined') { sqlh = sqlh + ",zone_parent" ; 
        var vK = parseInt (req_body.zone_parent);
        if (isNaN (vK) || vK === 0) {vK = "null";};
        sqlv = sqlv + "," + vK ; 
    }
    if (typeof req_body.description !== 'undefined') { sqlh = sqlh + ",description" ; sqlv = sqlv + ",'" + req_body.description + "'"; }
    if (typeof req_body.position    !== 'undefined') { sqlh = sqlh + ",position"    ; sqlv = sqlv + ",'" + req_body.position    + "'"; }
    if (typeof req_body.enabled     !== 'undefined') { sqlh = sqlh + ",enabled"     ; 
        var vK = parseInt (req_body.enabled);
        if (isNaN (vK) ) {vK = 0;};
        sqlv = sqlv + "," + vK ; 
    }
    if (typeof req_body.action      !== 'undefined') { sqlh = sqlh + ",action"      ; sqlv = sqlv + ",'" + req_body.action      + "'"; }
    if (typeof req_body.status      !== 'undefined') { sqlh = sqlh + ",status"      ; 
        var vK = parseInt (req_body.status);
        if (isNaN (vK) ) {vK = 0;};
        sqlv = sqlv + "," + vK ; 
    }
    var sqlc = "INSERT INTO zones (" + sqlh.substr(1) + ") VALUES (" + sqlv.substr(1) + ")";
     dblite.query(
        sqlc,
        function (err, data) {
            if ( err) {
                console.log(sqlc);
                callback(err, data);
            } else {
                dblite.lastRowID('zones', function (rowid) {
                    dblite.query(
                        "SELECT * FROM zones WHERE rowid = " + rowid,
                        {
                             zone_id : Number,
                             zone_parent : Number,
                             description : String, 
                             position : String,
                             enabled : Number,
                             action : String,
                             status : Number
                         },
                         function (err, data) {
                            callback(err, data[0]);
                        }
                    );
                });
            }
        }
    );
  },

  editZone: function(id, req_body, callback) {
    //  console.log('*** accessDBlite.editZone');
    var sqlh = "";
    // zone_id = id
    if (typeof req_body.zone_parent !== 'undefined') { 
        var vK = parseInt (req_body.zone_parent);
        if (isNaN (vK) || vK === 0) {vK = "null";};
        sqlh = sqlh + ",zone_parent = " + vK ; 
    }
    if (typeof req_body.description !== 'undefined') { sqlh = sqlh + ",description = '" + req_body.description + "'"; };
    if (typeof req_body.position    !== 'undefined') { sqlh = sqlh + ",position = '"    + req_body.position    + "'"; };
    if (typeof req_body.enabled     !== 'undefined'){ 
        var vK = parseInt (req_body.enabled);
        if (isNaN (vK) ) {vK = 0;};
        sqlh = sqlh + ",enabled = " + vK ; 
    }
    if (typeof req_body.action      !== 'undefined') { sqlh = sqlh + ",action = '"      + req_body.action      + "'"; }
    if (typeof req_body.status      !== 'undefined') { 
        var vK = parseInt (req_body.status);
        if (isNaN (vK) )  {vK = 0;};
        sqlh = sqlh + ",status = " + vK ; 
    }
    var sqlc = "UPDATE zones SET " + sqlh.substr(1) +" WHERE zone_id = " + id;
     dblite.query(
        sqlc,
        function (err, data) {
            if ( err) {
                console.log(sqlc);
                callback(err, data);
            } else {
                dblite.query(
                    "SELECT * FROM zones WHERE zone_id = " + id,
                    {
                         zone_id : Number,
                         zone_parent : Number,
                         description : String, 
                         position : String,
                         enabled : Number,
                         action : String,
                         status : Number
                     },
                     function (err, data) {
                        callback(err, data[0]);
                    }
                );
            }
        }
    );
  },
  // delete a zone
  deleteZone: function(id, callback) {
    //  console.log('*** accessDBlite.deleteZone');
    dblite.query(
        'DELETE FROM zones WHERE zone_id = :id ',
        {
          id: id
        },
        function (err, data) {
            callback(err);
        }
    );

  },

// -----------------------------------------------------------------------------
  // get all the devices
  getDevices: function(query, callback) {
    //  console.log('*** accessDBlite.getDevices');
    (typeof query.$skip   === 'undefined')  ? query.$$skip = 0 : query.$$skip = parseInt (query.$skip);
    (typeof query.$top    === 'undefined')  ? query.$$top  = 0 : query.$$top  = parseInt (query.$top );
    (typeof query.$chain  === 'undefined')  ? query.$$chain  = -1 : query.$$chain  = parseInt (query.$chain );
    var sqlc = 'SELECT * FROM devices';
    if (query.$$chain >= 0) {
        sqlc += ' WHERE zone_ID = ' + query.$$chain;
        if (query.$$chain === 0) {
            sqlc += ' OR zone_ID is null';
        }
 
    };
    sqlc += ' ORDER BY device_id';     
    dblite.query(
        sqlc,
        {
            device_id : Number,
            device_code : String,
            description : String, 
            position : String,
            enabled : Number,
            last_seen : String,
            zone_id : Number,
            action : String
        },
        function (err, data) {
            if ( !err) {
                query.$$count = data.length;
                if (query.$$skip > 0) {
                    data.splice (0,query.$$skip);
                }
                if (query.$$top > 0) {
                    data.splice (query.$$top,data.length-query.$$top);
                }
            }
            callback(err, data);
        }
    );
  },

  // get a  device
  getDevice: function(id, callback) {
    //  console.log('*** accessDBlite.getDevice');
    dblite.query(
        'SELECT * FROM devices WHERE device_id = :id ',
        {
          id: id
        },
        {
            device_id : Number,
            device_code : String,
            description : String, 
            position : String,
            enabled : Number,
            last_seen : String,
            zone_id : Number,
            action : String
        },
        function (err, data) {
            callback(err, data[0]);
        }
    );
  },

  // insert a  device
  insertDevice: function(req_body, callback) {
    //  console.log('*** accessDBlite.insertDevice');
    var sqlh = "";
    var sqlv = "";  

    if (typeof req_body.device_code !== 'undefined') { sqlh = sqlh + ",device_code" ; sqlv = sqlv + ",'" + req_body.device_code + "'"; }
    if (typeof req_body.description !== 'undefined') { sqlh = sqlh + ",description" ; sqlv = sqlv + ",'" + req_body.description + "'"; }
    if (typeof req_body.position    !== 'undefined') { sqlh = sqlh + ",position"    ; sqlv = sqlv + ",'" + req_body.position    + "'"; }
    if (typeof req_body.enabled     !== 'undefined') { sqlh = sqlh + ",enabled"     ; 
        var vK = parseInt (req_body.enabled);
        if (isNaN (vK) ) {vK = 0;};
        sqlv = sqlv + "," + vK ; 
    }
    if (typeof req_body.last_seen   !== 'undefined') { sqlh = sqlh + ",last_seen"   ; sqlv = sqlv + ",'" + req_body.last_seen   + "'"; }
    if (typeof req_body.zone_id !== 'undefined') { sqlh = sqlh + ",zone_id" ; 
        var vK = parseInt (req_body.zone_id);
        if (isNaN (vK) || vK === 0) {vK = "null";};
        sqlv = sqlv + "," + vK ; 
    }
    if (typeof req_body.action      !== 'undefined') { sqlh = sqlh + ",action"      ; sqlv = sqlv + ",'" + req_body.action      + "'"; }
    var sqlc = "INSERT INTO devices (" + sqlh.substr(1) + ") VALUES (" + sqlv.substr(1) + ")";
     dblite.query(
        sqlc,
        function (err, data) {
            if ( err) {
                console.log(sqlc);
                callback(err, data);
            } else {
                dblite.lastRowID('devices', function (rowid) {
                    dblite.query(
                        "SELECT * FROM devices WHERE rowid = " + rowid,
                        {
                           device_id : Number,
                           device_code : String,
                           description : String, 
                           position : String,
                           enabled : Number,
                           last_seen : String,
                           zone_id : Number,
                           action : String
                       },
                       function (err, data) {
                            callback(err, data[0]);
                        }
                    );
                });
            }
        }
    );
  },

  editDevice: function(id, req_body, callback) {
    //  console.log('*** accessDBlite.editDevice');
    var sqlh = "";
    // device_id = id
    if (typeof req_body.device_code !== 'undefined') { sqlh = sqlh + ",device_code = '" + req_body.device_code + "'"; }
    if (typeof req_body.description !== 'undefined') { sqlh = sqlh + ",description = '" + req_body.description + "'"; }
    if (typeof req_body.position    !== 'undefined') { sqlh = sqlh + ",position = '"    + req_body.position    + "'"; }
    if (typeof req_body.enabled     !== 'undefined'){ 
        var vK = parseInt (req_body.enabled);
        if (isNaN (vK) ) {vK = 0;};
        sqlh = sqlh + ",enabled = " + vK ; 
    }
    if (typeof req_body.last_seen   !== 'undefined') { sqlh = sqlh + ",last_seen = '"   + req_body.last_seen   + "'"; }
    if (typeof req_body.zone_id !== 'undefined') { 
        var vK = parseInt (req_body.zone_parent);
        if (isNaN (vK) || vK === 0) {vK = "null";};
        sqlh = sqlh + ",zone_id = " + vK ; 
    }
    if (typeof req_body.action      !== 'undefined') { sqlh = sqlh + ",action = '"      + req_body.action      + "'"; }
    var sqlc = "UPDATE devices SET " + sqlh.substr(1) +" WHERE device_id = " + id;
     dblite.query(
        sqlc,
        function (err, data) {
            if ( err) {
                console.log(sqlc);
                callback(err, data);
            } else {
                dblite.query(
                    "SELECT * FROM devices WHERE device_id = " + id,
                    {
                        device_id : Number,
                        device_code : String,
                        description : String, 
                        position : String,
                        enabled : Number,
                        last_seen : String,
                        zone_id : Number,
                        action : String
                    },
                                function (err, data) {
                        callback(err, data[0]);
                    }
                );
            }
        }
    );
  },
  // delete a device
  deleteDevice: function(id, callback) {
    //  console.log('*** accessDBlite.deleteDevice');
    dblite.query(
        'DELETE FROM devices WHERE device_id = :id ',
        {
          id: id
        },
        function (err, data) {
            callback(err);
        }
    );

  },
// -----------------------------------------------------------------------------
  // get all the params
  getParams: function(query, callback) {
    //  console.log('*** accessDBlite.getParams');
    (typeof query.$skip === 'undefined')  ? query.$$skip = 0 : query.$$skip = parseInt (query.$skip);
    (typeof query.$top  === 'undefined')  ? query.$$top  = 0 : query.$$top  = parseInt (query.$top );
    var sqlc = 'SELECT * FROM params';
    sqlc += ' ORDER BY id'; 
    dblite.query(
        sqlc,
        {
            id : Number,
            param_val : Number,
            description : String
        },
        function (err, data) {
            if ( !err) {
                query.$$count = data.length;
                if (query.$$skip > 0) {
                    data.splice (0,query.$$skip);
                }
                if (query.$$top > 0) {
                    data.splice (query.$$top,data.length-query.$$top);
                }
            }
            callback(err, data);
        }
    );
  },

  // get a  param
  getParam: function(id, callback) {
    //  console.log('*** accessDBlite.getParam');
    dblite.query(
        'SELECT * FROM params WHERE id = :id ',
        {
          id: id
        },
        {
            id : Number,
            param_val : Number,
            description : String
        },
        function (err, data) {
            callback(err, data[0]);
        }
    );
  },

  // insert a  param
  insertParam: function(req_body, callback) {
    //  console.log('*** accessDBlite.insertParam');
    var sqlh = "";
    var sqlv = "";  

    if (typeof req_body.id          !== 'undefined') { sqlh = sqlh + ",id"          ; sqlv = sqlv + ",'" + req_body.id + "'"; }
    if (typeof req_body.param_val   !== 'undefined') { sqlh = sqlh + ",param_val"   ; sqlv = sqlv + ",'" + req_body.param_val + "'"; }
    if (typeof req_body.description !== 'undefined') { sqlh = sqlh + ",description" ; sqlv = sqlv + ",'" + req_body.description + "'"; }
     var sqlc = "INSERT INTO params (" + sqlh.substr(1) + ") VALUES (" + sqlv.substr(1) + ")";
     dblite.query(
        sqlc,
        function (err, data) {
            if ( err) {
                console.log(sqlc);
                callback(err, data);
            } else {
                dblite.lastRowID('params', function (rowid) {
                    dblite.query(
                        "SELECT * FROM params WHERE rowid = " + rowid,
                        {
                           id : Number,
                           param_val : Number,
                           description : String
                        },
                        function (err, data) {
                            callback(err, data[0]);
                        }
                    );
                });
            }
        }
    );
  },

  editParam: function(id, req_body, callback) {
    //  console.log('*** accessDBlite.editParam');
    var sqlh = "";
    // id = id
    if (typeof req_body.param_val   !== 'undefined') { sqlh = sqlh + ",param_val = '"   + req_body.param_val + "'"; }
    if (typeof req_body.description !== 'undefined') { sqlh = sqlh + ",description = '" + req_body.description + "'"; }
     var sqlc = "UPDATE params SET " + sqlh.substr(1) +" WHERE id = " + id;
     dblite.query(
        sqlc,
        function (err, data) {
            if ( err) {
                console.log(sqlc);
                callback(err, data);
            } else {
                dblite.query(
                    "SELECT * FROM params WHERE id = " + id,
                    {
                        id : Number,
                        param_val : Number,
                        description : String
                    },
                    function (err, data) {
                        callback(err, data[0]);
                    }
                );
            }
        }
    );
  },
  // delete a param
  deleteParam: function(id, callback) {
    //  console.log('*** accessDBlite.deleteParam');
    dblite.query(
        'DELETE FROM params WHERE id = :id ',
        {
          id: id
        },
        function (err, data) {
            callback(err);
        }
    );

  },
  
// -----------------------------------------------------------------------------
  // get all the events
  getEvents: function(query, callback) {
    //  console.log('*** accessDBlite.getEvents');
    (typeof query.$skip   === 'undefined')  ? query.$$skip = 0 : query.$$skip = parseInt (query.$skip);
    (typeof query.$top    === 'undefined')  ? query.$$top  = 0 : query.$$top  = parseInt (query.$top );
    (typeof query.$chain  === 'undefined')  ? query.$$chain  = -1 : query.$$chain  = parseInt (query.$chain );
    var sqlc = 'SELECT * FROM events';
    if (query.$$chain >= 0) {
        sqlc += ' WHERE device_ID = ' + query.$$chain;
    }
    sqlc += ' ORDER BY id DESC'; 
    dblite.query(
        sqlc,
        {
            id : Number,
            event_time : String,
            device_id : Number,
            device_param : String, 
            zone_alarm : Number,
            processed : Number
        },
        function (err, data) {
            if ( !err) {
                query.$$count = data.length;
                if (query.$$skip > 0) {
                    data.splice (0,query.$$skip);
                }
                if (query.$$top > 0) {
                    data.splice (query.$$top,data.length-query.$$top);
                }
            }
            callback(err, data);
        }
    );
  },

  // get a  param
  getEvent: function(id, callback) {
    //  console.log('*** accessDBlite.getEvent');
    dblite.query(
        'SELECT * FROM events WHERE id = :id ',
        {
          id: id
        },
        {
            id : Number,
            event_time : String,
            device_id : Number,
            device_param : String, 
            zone_alarm : Number,
            processed : Number
        },
        function (err, data) {
            callback(err, data[0]);
        }
    );
  },

  // insert a  event
  insertEvent: function(req_body, callback) {
    //  console.log('*** accessDBlite.insertEvent');
    var sqlh = "";
    var sqlv = "";  

    if (typeof req_body.event_time   !== 'undefined') { sqlh = sqlh + ",event_time "  ; sqlv = sqlv + ",'" + req_body.event_time   + "'"; }
    if (typeof req_body.device_id    !== 'undefined') { sqlh = sqlh + ",device_id "   ; sqlv = sqlv + ",'" + req_body.device_id    + "'"; }
    if (typeof req_body.device_param !== 'undefined') { sqlh = sqlh + ",device_param" ; sqlv = sqlv + ",'" + req_body.device_param + "'"; }
    if (typeof req_body.zone_alarm   !== 'undefined') { sqlh = sqlh + ",zone_alarm"   ; sqlv = sqlv + ",'" + req_body.zone_alarm   + "'"; }
    if (typeof req_body.processed    !== 'undefined') { sqlh = sqlh + ",processed "   ; sqlv = sqlv + ",'" + req_body.processed    + "'"; }
     var sqlc = "INSERT INTO events (" + sqlh.substr(1) + ") VALUES (" + sqlv.substr(1) + ")";
     dblite.query(
        sqlc,
        function (err, data) {
            if ( err) {
                console.log(sqlc);
                callback(err, data);
            } else {
                dblite.lastRowID('events', function (rowid) {
                    dblite.query(
                        "SELECT * FROM events WHERE rowid = " + rowid,
                        {
                           id : Number,
                           event_time : String,
                           device_id : Number,
                           device_param : String, 
                           zone_alarm : Number,
                           processed : Number
                       },
                       function (err, data) {
                            callback(err, data[0]);
                        }
                    );
                });
            }
        }
    );
  },

  editEvent: function(id, req_body, callback) {
    //  console.log('*** accessDBlite.editEvent');
    var sqlh = "";
    // id = id
    if (typeof req_body.event_time   !== 'undefined') { sqlh = sqlh + ",event_time = '"  + req_body.event_time   + "'"; }
    if (typeof req_body.device_id    !== 'undefined') { sqlh = sqlh + ",device_id = '"   + req_body.device_id    + "'"; }
    if (typeof req_body.device_param !== 'undefined') { sqlh = sqlh + ",device_param= '" + req_body.device_param + "'"; }
    if (typeof req_body.zone_alarm   !== 'undefined') { sqlh = sqlh + ",zone_alarm= '"   +  req_body.zone_alarm  + "'"; }
    if (typeof req_body.processed    !== 'undefined') { sqlh = sqlh + ",processed = '"   + req_body.processed    + "'"; }
     var sqlc = "UPDATE events SET " + sqlh.substr(1) +" WHERE id = " + id;
     dblite.query(
        sqlc,
        function (err, data) {
            if ( err) {
                console.log(sqlc);
                callback(err, data);
            } else {
                dblite.query(
                    "SELECT * FROM events WHERE id = " + id,
                    {
                        id : Number,
                        event_time : String,
                        device_id : Number,
                        device_param : String, 
                        zone_alarm : Number,
                        processed : Number
                    },
                    function (err, data) {
                        callback(err, data[0]);
                    }
                );
            }
        }
    );
  },
  // delete a param
  deleteEvent: function(id, callback) {
//  console.log('*** accessDBlite.deleteEvent');
    dblite.query(
        'DELETE FROM events WHERE id = :id ',
        {
          id: id
        },
        function (err, data) {
            callback(err);
        }
    );

  }
// -----------------------------------------------------------------------------

};
