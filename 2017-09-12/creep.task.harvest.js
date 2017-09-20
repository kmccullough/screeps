var config = require('config');
var $config = _.propertyOf(config);
var log = require('log');

module.exports = {
    
    name: 'harvest',
    
    enter: function(creep, oldTask) {
        console.log('Creep', creep, 'task', creep.memory.task, 'entering from task', oldTask.name);
    },
    
    run: function(creep, opts) {

        var $opts = _.propertyOf(opts),
            defaultTask = $opts('task.default');
            
        if (_.sum(creep.carry) >= creep.carryCapacity) {

            // If it's not a harvester, it's just full
            if (creep.memory.role != 'harvester') {
                creep.setTask($opts('task.full') || defaultTask);
                return; // RETURN
            }
            
            // Do we want to drop harvest?...
            
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
    
    exit: function(creep, newTask) {
        console.log('Creep', creep, 'role', creep.memory.role, 'exiting for role', newTask.name);
    },
    
};
