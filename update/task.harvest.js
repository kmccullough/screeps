const config = require('config');
const log = require('log');
const colony = require('colony');

module.exports = {
    
    name: 'harvest',
    
    enter: function(exitTask) {
        
    },
    
    run: function(task, opts) {

        let creep = this;

        let defaultTask = creep.roles[creep.memory.role].defaultTask,
            $opts = _.propertyOf(opts);

        // If we can't carry any more
        if (_.sum(creep.carry) >= creep.carryCapacity) {

            creep.setTask($opts('task.full') || defaultTask);

        // If we can carry more
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
                let result = creep.harvest(target);
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
