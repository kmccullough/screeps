var config = require('config');
var $config = _.propertyOf(config);
var log = require('log');
var colony = require('colony');

module.exports = {
    
    name:      'pawn',
    shortName: 'v',
    body:      [ MOVE, WORK, CARRY ],
    
    run: function() {
        
        creep.$role.run();

    }
    
};
