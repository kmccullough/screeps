var config = require('config');
var $config = _.propertyOf(config);
var log = require('log');
var colony = require('colony');

module.exports = {
    
    name:      'knight',
    shortName: '^',
    body:      [ MOVE, MOVE, ATTACK ],

    run: function() {
        
        creep.$role.run();

    }
    
};
