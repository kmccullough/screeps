var config = require('config');
var $config = _.propertyOf(config);
var log = require('log');
var colony = require('colony');

module.exports = {
    
    name:        'defender',
    shortName:   'P',
    minimumBody: [ MOVE, ATTACK ],
    
    tasks: {
        default: {
            task: {
                default: 'defend',
            }
        },
        defend: {
            task: {
                none:  'sentry',
                error: 'sentry',
            }
        }
    },
    
    enter: function(creep, oldRole) {
        console.log('Creep', creep, 'role', creep.memory.role, 'entering from role', oldRole.name);
    },
    
    run: function(creep) {

        // Return false to prevent task running
    },
    
    exit: function(creep, newRole) {
        console.log('Creep', creep, 'role', creep.memory.role, 'exiting for role', newRole.name);
    },
    
};
