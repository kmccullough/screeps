var config = require('config');
var log = require('log');
var colony = require('colony');

module.exports = {
    
    name: 'build',
    
    enter: function(exitTask) {
        
    },
    
    run: function(task, opts) {

        var creep = this,
            defaultTask = creep.roles[creep.memory.role].defaultTask,
            $opts = _.propertyOf(opts);
        if (_.sum(creep.carry) >= creep.carryCapacity) {

            // I'm not a harvester, move on...
            if (creep.memory.role.indexOf('harvester') < 0
                && creep.memory.role.indexOf('Harvester') < 0
            ) {
                creep.setTask($opts('task.full') || defaultTask);
                return; // RETURN
            }
            
            let hasMules = creep.room.find(FIND_MY_CREEPS, {
                    filter: (o) => o.memory.role.indexOf('mule') >= 0
                        || o.memory.role.indexOf('Mule') >= 0
                }).length;

            // No mules!        
            if (!hasMules) {
                creep.setTask($opts('task.full') || defaultTask);
                return; // RETURN
            }
            
            creep.drop(RESOURCE_ENERGY, creep.carryCapacity / 2);
            
        } else {
            let target,
                targets = creep.room.find(FIND_SOURCES_ACTIVE);
            
            // targets = targets.sort((...args) => {
            //     let weights = [0, 0];
            //     for (let i = 0; i < 2; ++i) {
            //         let structure = args[i],
            //             occupants = creep.room.lookForAtArea(
            //                 LOOK_CREEPS,
            //                 // top, left, bottom, right
            //                 structure.pos.y - 1,
            //                 structure.pos.x - 1,
            //                 structure.pos.y + 1,
            //                 structure.pos.x + 1,
            //                 true
            //             ).length;
            //         let multiplier = config.get(
            //             (p) => `priorities.${p[0]}.harvest.criteria.${p[1]}`,
            //             [colony.memory.intention, 'default'],
            //             ['occupants',             'default']
            //         );
            //         // if ((''+multiplier).charAt((''+multiplier).length - 1) === '%') {
            //         //     // weights[i] *= multiplier.slice(0, -1) * Math.max(0, 8 - occupants);
            //         // } else if (multiplier === 0 || multiplier) {
            //         //     weights[i] += multiplier * Math.max(0, 8 - occupants);
            //         // }
            //         weights[i] += multiplier * Math.max(0, 8 - occupants);
            //         console.log('occupants', occupants, weights[i]);
            //     }
                
            //     return weights[0] > weights[1] ? -1 : weights[0] < weights[1] ? 1 : 0;
            // });
            
            target = targets[0];
            
            if (target) {
                // Go after it
                var result = creep.harvest(target);
                if (result < OK) {
                    switch (result) {
                        case ERR_NOT_IN_RANGE:
                            creep.moveTo(target);
                            break;
                        case ERR_INVALID_TARGET:
                            creep.setTask($opts('task.error') || defaultTask);
                            console.log('Invalid target while harvesting', target);
                            break;
                        default:
                            creep.setTask($opts('task.error') || defaultTask);
                            console.log('Unkown error harvesting', result);
                            break;
                    }
                }
            }
        }

    },
     
    exit: function(enterTask) {
        
    }
    
};
