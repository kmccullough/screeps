var config = require('config');
var $config = _.propertyOf(config);
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
            creep.setTask($opts('task.full') || defaultTask);
        } else {
            let target = $opts('target');
            let targets;
            // Find a source
            if (target === undefined) {
                targets = creep.room.find(FIND_MY_STRUCTURES, {
                    ignoreCreeps: true,
                    filter: (o) => o.energy && (
                            o.structureType == STRUCTURE_EXTENSION
                            || o.structureType == STRUCTURE_CONTAINER
                            || o.structureType == STRUCTURE_STORAGE
                        )
                });
                
                targets.concat([creep.room.find(FIND_MY_CREEPS, {
                    filter: (o) => o.energy && (
                            o.memory.role.indexOf('harvester') >= 0
                            || o.memory.role.indexOf('Harvester') >= 0
                        )
                })]);
                
                targets.concat([creep.room.find(FIND_DROPPED_ENERGY)]);
                    
                targets = targets.sort((...args) => {
                    let weights = [0, 0];
                    for (let i = 0; i < 2; ++i) {
                        
                        if (args[i].resourceType) {
                            
                            let multiplier = config.get(
                                (p) => `priorities.${p[0]}.steal.criteria.${p[1]}`,
                                [colony.memory.intention, 'default'],
                                ['dropped',               'default']
                            );
                            if ((''+multiplier).charAt((''+multiplier).length - 1) === '%') {
                                weights[i] *= multiplier.slice(0, -1);
                            } else if (multiplier === 0 || multiplier) {
                                weights[i] += multiplier;
                            }
                            
                        } else if (args[i].structureType) {
                            
                            if (args[i].structureType == STRUCTURE_EXTENSION) {
                                
                                let multiplier = config.get(
                                    (p) => `priorities.${p[0]}.steal.criteria.${p[1]}`,
                                    [colony.memory.intention, 'default'],
                                    ['extension',             'default']
                                );
                                if ((''+multiplier).charAt((''+multiplier).length - 1) === '%') {
                                    weights[i] *= multiplier.slice(0, -1);
                                } else if (multiplier === 0 || multiplier) {
                                    weights[i] += multiplier;
                                }
                                
                            } else if (args[i].structureType == STRUCTURE_CONTAINER) {
                                
                                let multiplier = config.get(
                                    (p) => `priorities.${p[0]}.steal.criteria.${p[1]}`,
                                    [colony.memory.intention, 'default'],
                                    ['container',             'default']
                                );
                                if ((''+multiplier).charAt((''+multiplier).length - 1) === '%') {
                                    weights[i] *= multiplier.slice(0, -1);
                                } else if (multiplier === 0 || multiplier) {
                                    weights[i] += multiplier;
                                }
                                
                            } else if (args[i].structureType == STRUCTURE_STORAGE) {
                                
                                let multiplier = config.get(
                                    (p) => `priorities.${p[0]}.steal.criteria.${p[1]}`,
                                    [colony.memory.intention, 'default'],
                                    ['storage',             'default']
                                );
                                if ((''+multiplier).charAt((''+multiplier).length - 1) === '%') {
                                    weights[i] *= multiplier.slice(0, -1);
                                } else if (multiplier === 0 || multiplier) {
                                    weights[i] += multiplier;
                                }

                            }
                            
                        } else {
                            
                            let multiplier = config.get(
                                (p) => `priorities.${p[0]}.steal.criteria.${p[1]}`,
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
                
                target = targets[0];
                
            }
            if (target) {
                
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
            }
        }

    },
     
    exit: function(enterTask) {
        
    }
    
};
