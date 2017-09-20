const config = require('config');
const log = require('log');
const colony = require('colony');

module.exports = {
    
    enter: function(exitTask) {
        
        let creep = this,
            memory = creep.memory.haul = creep.memory.haul || {};
        
        memory.target = null;
        memory.targets = [];
        
    },
    
    run: function(task, opts) {

        let creep = this,
            memory = creep.memory.haul;

        // debugger;
        let defaultTask = creep.roles[creep.memory.role].defaultTask,
            $opts = _.propertyOf(opts);

        // Creep is full!
        if ( _.sum(creep.carry) >= creep.carryCapacity ) {
            creep.setTask($opts('task.full') || defaultTask);
            return; // RETURN
        }

        let targets = creep.room.find(FIND_DROPPED_RESOURCES);


        targets = targets.concat(
            creep.room.find(FIND_MY_CREEPS, {
                filter: (o) => o.carry[RESOURCE_ENERGY] &&
                    o.memory.takeEnergy
            })
        );

        targets = targets.concat(
            creep.room.find(FIND_STRUCTURES, {
                filter: (o) => (
                    o.structureType === STRUCTURE_CONTAINER
                    || o.structureType === STRUCTURE_STORAGE
                ) && o.store[RESOURCE_ENERGY]
            })
        );

        if (creep.colony.spawn.energy) {
            targets = targets.concat(creep.colony.spawn);
        }

        targets = targets.sort((...args) => {
            let weights = [0, 0];
            for (let i = 0; i < 2; ++i) {
                
                if (args[i].resourceType) {
                    
                    let multiplier = config.get(
                        (p) => `priorities.${p[0]}.haul.criteria.${p[1]}`,
                        [colony.memory.intention, 'default'],
                        ['dropped',               'default']
                    );
                    if ((''+multiplier).charAt((''+multiplier).length - 1) === '%') {
                        weights[i] *= multiplier.slice(0, -1);
                    } else if (multiplier === 0 || multiplier) {
                        weights[i] += multiplier;
                    }
                    
                } else if (args[i].structureType) {
                    
                    if (args[i].structureType === STRUCTURE_CONTAINER) {
                        
                        let multiplier = config.get(
                            (p) => `priorities.${p[0]}.haul.criteria.${p[1]}`,
                            [colony.memory.intention, 'default'],
                            ['container',             'default']
                        );
                        if ((''+multiplier).charAt((''+multiplier).length - 1) === '%') {
                            weights[i] *= multiplier.slice(0, -1);
                        } else if (multiplier === 0 || multiplier) {
                            weights[i] += multiplier;
                        }
                        
                    } else if (args[i].structureType === STRUCTURE_STORAGE) {
                    
                        let multiplier = config.get(
                            (p) => `priorities.${p[0]}.haul.criteria.${p[1]}`,
                            [colony.memory.intention, 'default'],
                            ['storage',               'default']
                        );
                        if ((''+multiplier).charAt((''+multiplier).length - 1) === '%') {
                            weights[i] *= multiplier.slice(0, -1);
                        } else if (multiplier === 0 || multiplier) {
                            weights[i] += multiplier;
                        }
                        
                    }
                    
                } else {
                    
                    let multiplier = config.get(
                        (p) => `priorities.${p[0]}.haul.criteria.${p[1]}`,
                        [colony.memory.intention, 'default'],
                        ['creep',                 'default']
                    );
                    if ((''+multiplier).charAt((''+multiplier).length - 1) === '%') {
                        weights[i] *= multiplier.slice(0, -1);
                    } else if (multiplier === 0 || multiplier) {
                        weights[i] += multiplier;
                    }
                    
                }
            
            }
            
            return weights[0] > weights[1] ? -1 : weights[0] < weights[1] ? 1 : 0;
        });
        
        let target = targets[0];
        
        if (target) {
            
            // Go after it
            let result;
            if (target.resourceType) {
                result = creep.pickup(target);
            } else {
                result = creep.withdraw(target, RESOURCE_ENERGY);
            }
            
            if (result < OK) {
                switch (result) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(target);
                        break;
                    case ERR_INVALID_TARGET:
                        creep.setTask($opts('task.error') || defaultTask);
                        console.log('Invalid target while stealing', target);
                        break;
                    default:
                        creep.setTask($opts('task.error') || defaultTask);
                        console.log('Unknown error stealing', result);
                        break;
                }
            }
        } else {
            
            creep.setTask($opts('task.none') || defaultTask);
            console.log('No target while stealing');
            
        }
        
    },
     
    exit: function(enterTask) {
        
    }
    
};
