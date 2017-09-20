var config = require('config');
var log = require('log');
var colony = require('colony');

module.exports = {
    
    enter: function(exitTask) {
        
        let creep = this,
            memory = creep.memory.build = creep.memory.build || {};
        
        memory.target = null;
        memory.targets = [];
        
    },
    
    run: function(task, opts) {
        
        let creep = this,
            memory = creep.memory.build,
            defaultTask = creep.roles[creep.memory.role].defaultTask,
            $opts = _.propertyOf(opts);
            
        
        // Creep has no energy to do its job
        if ( !creep.carry[RESOURCE_ENERGY] ) {
            creep.setTask($opts('task.empty') || defaultTask);
            return; // RETURN
        }

        // Creep has no target
        if (!memory.target) {
            
            // Creep has targets or there are colony targets
            if (memory.targets.length
                || Memory.build && Memory.build.targets && Memory.build.targets.length
            ) {
                
                // Creep will use a colony target
                if (!memory.targets.length) {
                    memory.targets = [Memory.build.targets.shift()];
                }
                
            // Creep and colony have no targets
            } else {

                // Process user added construction sites
                let targets = _.values(Game.constructionSites);

                // Figure out where to build other things
                if (!targets.length) {
                }
            
                // Nothing to construct! Break time!
                if (!targets.length) {
                    creep.setTask($opts('task.none') || defaultTask);
                    return; // RETURN
                }
                
                // Cache object properties we care about to speed up the sort
                let objects = {};
                
                let sameRoomValue = config.get(
                    (p) => `priorities.${p[0]}.build.room.${p[1]}`,
                    [colony.memory.intention, 'default'],
                    ['same',                  'default']
                ) || 0;
                let sameRoomMultiplies = false;
                if ((''+sameRoomValue).charAt((''+sameRoomValue).length - 1) === '%') {
                    sameRoomValue = +sameRoomValue.slice(0, -1);
                    sameRoomMultiplies = true;
                }
                    
                let differentRoomValue = config.get(
                    (p) => `priorities.${p[0]}.build.room.${p[1]}`,
                    [colony.memory.intention, 'default'],
                    ['different',             'default']
                ) || 0;
                let differentRoomMultiplies = false;
                if ((''+differentRoomValue).charAt((''+differentRoomValue).length - 1) === '%') {
                    differentRoomValue = +differentRoomValue.slice(0, -1);
                    differentRoomMultiplies = true;
                }
                
                let completionValue = config.get(
                    (p) => `priorities.${p[0]}.build.room.${p[1]}`,
                    [colony.memory.intention, 'default'],
                    ['completion',            'default']
                ) || 0;
                let completionMultiplies = false;
                if ((''+completionValue).charAt((''+completionValue).length - 1) === '%') {
                    completionValue = +completionValue.slice(0, -1);
                    completionMultiplies = true;
                }

                // Sort and assign what we got...
                targets = targets.sort((...args) => {
                    
                    // Iterate the given two sort args
                    let weights = [0, 0];
                    for (let i = 0; i < 2; ++i) {

                        let object = args[i],
                            o = objects[object.id];

                        // Cache the information we care about
                        if (!o) {
                            
                            o = objects[object.id] = {};
                            
                            let structureType = config.$constants[object.structureType];
                            
                            let multiplier = config.get(
                                (p) => `priorities.${p[0]}.build.structures.multiplier`,
                                [colony.memory.intention, 'default']
                            );
                            
                            // Get the priority of this type of structure from config
                            o.buildPriority = config.get(
                                (p) => `priorities.${p[0]}.build.structures.${p[1]}`,
                                [colony.memory.intention, 'default'],
                                [structureType,           'default']
                            ) * (multiplier || multiplier === 0 ? multiplier : 1);
                            
                            o.isSameRoom = object.room === creep.room;

                            let spawn = object.pos.findClosestByRange(FIND_MY_SPAWNS);
                            o.spawnRange = spawn ? object.pos.getRangeTo(spawn) : Infinity;
                            
                        }
                        
                        // Start adding up the priority...
                        
                        if (o.weight === undefined) {
                            
                            o.weight = o.buildPriority;
                            
                            if (o.isSameRoom) {
                                if (sameRoomMultiplies) {
                                    o.weight *= sameRoomValue;
                                } else {
                                    o.weight += sameRoomValue;
                                }
                            } else {
                                if (differentRoomMultiplies) {
                                    o.weight *= differentRoomValue;
                                } else {
                                    o.weight += differentRoomValue;
                                }
                            }
                        
                            let progress = completionValue * (1 - object.progress / object.progressTotal);
                            if (completionMultiplies) {
                                o.weight *= progress;
                            } else {
                                o.weight += progress;
                            }
                            
                            o.weight *= (20 - o.spawnRange);
                            
                        }
                        
                        weights[i] = o.weight;
                        
                    }
                    
                    // Return the sort order
                    return weights[0] > weights[1] ? -1 : weights[0] < weights[1] ? 1 : 0;
                    
                });
                
                var cacheBuildPriorities = config.get('cache.priorities.build');
                if (cacheBuildPriorities) {
                    targets = targets.slice(0, cacheBuildPriorities);
                }
                
                // Store the calculated targets for the colony
                Memory.build = Memory.build || {};
                Memory.build.targets = _.pluck(targets, 'id');
                
                // And take one for itself
                memory.targets = [Memory.build.targets.shift()];

            }
            
            // Target the first target in the queue
            memory.target = memory.targets.shift();
            
        }

        let target = Game.getObjectById(memory.target);
        
        if (!target) {
            memory.target = null;
            return // RETURN
        }
            
        let result = creep.build(target);
        
        if (result < OK) {
            switch (result) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
                case ERR_INVALID_TARGET:
                    creep.setTask($opts('task.error') || defaultTask);
                    console.log('Invalid target while building', target);
                    memory.target = null;
                    break;
                default:
                    creep.setTask($opts('task.error') || defaultTask);
                    console.log('Unknown error while building', result);
                    memory.target = null;
                    break;
            }
        }
        
    },
     
    exit: function(enterTask) {
        
    },
    
    construct: function(target) {
        
    }
    
};
