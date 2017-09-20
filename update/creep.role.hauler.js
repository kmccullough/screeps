const config = require('config');
const log = require('log');
const colony = require('colony');

module.exports = {
    
    name:        'hauler',
    shortName:   'h',
    minimumBody: [ MOVE, WORK, CARRY ],
    
    tasks: {
        default: {
            task: {
                default: 'mule',
            }
        },
        mule: {
            task: {
                none:  'harvest',
                full:  'store.spawn',
                error: 'store.spawn',
            }
        },
        harvest: {
            task: {
                full:  'store.spawn',
                error: 'store.spawn',
            }
        },
        'store.spawn': {
            task: {
                none:  'store.tower',
                full:  'store.tower',
                error: 'store.tower',
            }
        },
        'store.tower': {
            task: {
                none:  'store.room',
                full:  'store.room',
                error: 'store.room',
            }
        },
        'store.room': {
            task: {
                none:  'store.spawn',
                full:  'store.spawn',
                error: 'store.spawn'
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
