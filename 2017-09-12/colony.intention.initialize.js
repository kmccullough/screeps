var config = require('config');
let $ = config.$();
var log = require('log');

module.exports = {
    
    name: 'initialize',
    
    enter: function(exitIntent) {
        
    },

    run: function(colony) {
        
        let intention = this;
        
        let spawns = _.values(colony.spawns),
            rooms  = _.values(colony.rooms);
            
        colony.cleanMemory();
    
        rooms.forEach((room) => {
            // console.log(room.name);
            var towers = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
            towers.forEach((tower) => {
                // console.log('tower', tower.id);
                var hostiles = room.find(FIND_HOSTILE_STRUCTURES, {
                    filter: (o) => {
                        return o.structureType == STRUCTURE_ROAD
                            || o.my && (
                                o.structureType == STRUCTURE_SPAWN
                            )
                    }
                });
                if (hostiles.length) {
                    console.log('hostiles!');
                    tower.attack(hostiles[0]);
                } else if (tower.energy > $('tower.minDefenseEnergy')) {
                    let targets = room.find(FIND_STRUCTURES, {
                        filter: (o) => {
                            return o.hits < o.hitsMax && (
                                (
                                    o.structureType == STRUCTURE_ROAD
                                    || o.structureType == STRUCTURE_WALL
                                )
                                || o.my && (
                                    o.structureType == STRUCTURE_SPAWN
                                    || o.structureType == STRUCTURE_EXTENSION
                                    || o.structureType == STRUCTURE_RAMPART
                                    || o.structureType == STRUCTURE_PORTAL
                                    || o.structureType == STRUCTURE_CONTROLLER
                                    || o.structureType == STRUCTURE_LINK
                                    || o.structureType == STRUCTURE_STORAGE
                                    || o.structureType == STRUCTURE_TOWER
                                    || o.structureType == STRUCTURE_OBSERVER
                                    || o.structureType == STRUCTURE_POWER_BANK
                                    || o.structureType == STRUCTURE_POWER_SPAWN
                                    || o.structureType == STRUCTURE_EXTRACTOR
                                    || o.structureType == STRUCTURE_LAB
                                    || o.structureType == STRUCTURE_TERMINAL
                                    || o.structureType == STRUCTURE_CONTAINER
                                    || o.structureType == STRUCTURE_NUKER
                                )
                            );
                        }
                    });
                    targets.concat([room.find(FIND_MY_CREEPS, {
                        filter: o => o.hits < o.hitsMax
                    })]);
                    if (targets.length) {
                        targets = targets.sort((...args) => {
                            let weights = [0, 0];
                            for (let i = 0; i < 2; ++i) {
                                if (args[i].structureType) {
                                    let structure = args[i],
                                        structureType = config.$constants[args[i].structureType];
                                    let repairPriority = config.get(
                                        (p) => `priorities.${p[0]}.repair.structures.${p[1]}`,
                                        [intention.name, 'default'],
                                        [structureType,  'default']
                                    );
                                    weights[i] += repairPriority * (1 - args[i].hits / args[i].hitsMax);
                                } else {
                                    let creep = args[i],
                                        creepType = creep.memory.role;
                                    let repairPriority = config.get(
                                        (p) => `priorities.${p[0]}.repair.creeps.${p[1]}`,
                                        [intention.name, 'default'],
                                        [creepType,      'default']
                                    );
                                    weights[i] += repairPriority * (1 - args[i].hits / args[i].hitsMax);
                                }
                            }
                            return weights[0] > weights[1] ? -1 : weights[0] < weights[1] ? 1 : 0;
                        });
                        let target = targets[0],
                            result = tower.repair(target);
                        if (result < OK) {
                            switch (result) {
                                case ERR_NOT_ENOUGH_RESOURCES:
                                    console.log(`Not enough energy to repair ${target.name}|${target.id}`);
                                    break;
                                case ERR_INVALID_TARGET:
                                    console.log(`The target is not a valid repairable object: ${target.name}|${target.id}`);
                                    break;
                                case ERR_RCL_NOT_ENOUGH:
                                    console.log(`Room Controller Level insufficient to use ${target.name}|${target.id}.`);
                                    break;
                                default:
                            }
                            console.log('tower', result);
                        }
                    }
                }
            });
        });
        
                // Maximizing energy input means:
                    // zero harvest loss
                    // (source.energyCapacity / 300) per tick harvesting up to maximum available spaces next to sources
                    // all sources harvested
                    // roads and haulers from harvesting to storage
        

        
        
        // The first creep must have MOVE,CARRY,WORK but can have another
        // WORK or two of MOVE/CARRY so that he can collect enough and bring
        // it back for the next creep to spawn.
        // This harvester adds to its needs: spawning of a hauler to help it.
        // Harvester goes into collecting mode, leaving the hauler to collect
        // what's on the ground or in the harvester's buffer, and returning
        // it to spawn.
        // This continues until all sources in the room are addressed in the
        // same manner, except that additional harvesters need not have CARRY
        // and can instead watch their hauler need in the queue and their
        // energy level and guage whether they should drop some energy to be
        // picked up in reasonable time.
        // Next up is to spawn an upgrader to upgrade the room with body parts
        // MOVE,CARRY,WORK,WORK so that he can move to the site, carry the
        // energy brought to him to upgrade the room, and work work on
        // upgrading the room.

        // Trigger:
        
            // Colony drops below some working number of creeps (e.g. 5), with some minimum level of skill
            // (e.g. 100 creeps and none can harvest), or perhaps some minimum level
            // of production. Some conditions may override (e.g. war condition?)
        
        // Setup
        
            // Build new spawn queue
        
        // Objectives
        
            // >= 1 source in the room has >= 1 drop harvester
            // All drop harvests have >=1 hauler and a container
            // >= 1 upgrader
            // Recycle creeps that can't meet demand until: no more such creeps or all other objectives fulfilled
            
        // RC1:
        // - road        *
        // - container   5
        // - extension   [rc2]
        // - wall        [rc2]
        // - rampart     [rc2]
        // - tower       [rc3]
        // - storage     [rc4]
        // - link        [rc5]
        // - extractor   [rc6]
        // - lab         [rc6]
        // - terminal    [rc6]
        // - spawn       [rc7]
        // - observer    [rc8]
        // - power_spawn [rc8]
        // - nuker       [rc8]
        
        
        if (false) {
            
            if (!colony.creeps.length) {

                // Spawn first peon "v1"; role: harvester (task: harvest and return)

            } else if (colony.creeps.length == 1) {
            
                // If colony.creeps[0].role != 'harvester'
                
                    // If colony.creeps[0].canSatisfyRole('harvester')
        
                        // colony.creeps[0].setRole('harvester')
        
                    // Else if NOT colony.creeps[0].canSatisfyRole('harvester')
                
                        // Spawn peon "v2"; role: harvester (task: harvest and return)
                        // When "v2" spawns:
                            // If colony.creeps[0].canSatisfyRole('hauler')
                                // colony.creeps[0].setRole('hauler')
                            // Else if NOT colony.creeps[0].canSatisfyRole('hauler')
                                // Spawn second peon "v2"; role: hauler (task: collect drops, carry to consumers)
        
                // Else if colony.creeps[0].role == 'harvester'
            
                    // Spawn second peon "v2"; role: hauler (task: collect drops, carry to consumers)
                    
            }
                    
        } // if (false)
        

        
        
        
        _.forOwn($('Creep.roles'), function(role) {
            var $role = _.propertyOf(role);
            var creeps = rooms.reduce((creeps, room) => {
                return creeps.concat(
                    room.find(FIND_MY_CREEPS, {
                        filter: (o) => o.memory.role == role.name
                    })
                );
            }, []);
            
            //console.log('Handling ' + creeps.length + ' "' + role.name + '".');
    
            var params = ['min', 'max']
                .reduce((o, p) => {
                    let v = $(`spawn['${role.name}']['${p}']`);
                    if (!v && v !== 0) {
                        v = $(`spawn.default['${p}']`);
                    }
                    o[p] = v;
                    return o;
                }, {});
            params = _.extend(params, {
                //
            });
    
            // Crowd control
            if (creeps.length < params.min) {
                // Spawn more...
                console.log(`Not enough ${role.plural}`);
                if ($role('allow.spawn') === false) {
                    console.log(`Spawning ${role.name} disabled.`);
                } else {
                    var result = spawns[0].createCreep(role.body || [], undefined, {
                        role: role.name,
                        task: role.defaultTask
                    });
                    if (result < OK) {
                        switch (result) {
                            case ERR_NOT_ENOUGH_ENERGY:
                                console.log(`Not enough energy to spawn ${role.name}`);
                                break;
                            case ERR_BUSY:
                                console.log(`Spawner too busy to spawn ${role.name}`);
                                break;
                            default:
                                
                        }
                    } else {
                        console.log(`Spawning another ${role.name}`);
                    }
                }
            } else if (role.max && creeps.length > role.max) {
                // Suicide
                console.log(`Too many ${role.plural}`);
                if (creep.recycle) {
                    console.log(`Recycling ${role.name} ${creep}`);
                    console.log(`Recycling not yet implemented.`);
                } else if (creep.suicide) {
                    console.log(`Suiciding ${role.name} ${creep}`);
                    console.log(`Suiciding not yet implemented.`);
                } else {
                    console.log(`Recycling and Suiciding ${role.name} disabled`);
                }
            }
            log.log('3');
    
            // Actions
            if (creeps.length) {
                creeps.forEach(function(creep) {
                    // creep.$model.run(colony);
                    creep.runTask(colony);
                });
            }
        });
        
        
    },
     
    exit: function(enterIntent) {
        
    }
    
};