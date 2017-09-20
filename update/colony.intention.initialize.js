const config = require('config');
const log = require('log');

module.exports = {
    
    name: 'initialize',
    
    enter: function(exitIntent) {

    },

    run: function(colony) {
        
        let intention = this;
        
        let rooms  = _.values(colony.rooms);
            
        colony.cleanMemory();
    
        rooms.forEach((room) => {
            
            // Handle turrets ------
            
            // console.log(room.name);
            let towers = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });
            towers.forEach((tower) => {
                // console.log('tower', tower.id);
                let hostiles = room.find(FIND_HOSTILE_STRUCTURES, {
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
                } else if (tower.energy > config.$('tower.minDefenseEnergy')) {
                    let targets = SECOND.find(FIND_STRUCTURES, {
                        filter: (o) => {
                            return o.hits < o.hitsMax && (
                                (
                                    o.structureType === STRUCTURE_ROAD
                                    || o.structureType === STRUCTURE_WALL
                                )
                                || o.my && (
                                    o.structureType === STRUCTURE_SPAWN
                                    || o.structureType === STRUCTURE_EXTENSION
                                    || o.structureType === STRUCTURE_RAMPART
                                    || o.structureType === STRUCTURE_PORTAL
                                    || o.structureType === STRUCTURE_CONTROLLER
                                    || o.structureType === STRUCTURE_LINK
                                    || o.structureType === STRUCTURE_STORAGE
                                    || o.structureType === STRUCTURE_TOWER
                                    || o.structureType === STRUCTURE_OBSERVER
                                    || o.structureType === STRUCTURE_POWER_BANK
                                    || o.structureType === STRUCTURE_POWER_SPAWN
                                    || o.structureType === STRUCTURE_EXTRACTOR
                                    || o.structureType === STRUCTURE_LAB
                                    || o.structureType === STRUCTURE_TERMINAL
                                    || o.structureType === STRUCTURE_CONTAINER
                                    || o.structureType === STRUCTURE_NUKER
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
                                        [FIRST.name, 'default'],
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
        // Next up is to spawn an hauler to upgrade the room with body parts
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
            // >= 1 hauler
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
        
        intention.STATES = _.mapValues(_.invert([
            'STATES_BEGIN',
            
            'FIRST_BEGIN',
            'FIRST_ENERGY',
            'FIRST_BUSY',
            'FIRST_ERROR',
            'FIRST_SPAWNING',
            'FIRST_END',
            
            'SECOND_BEGIN',
            'SECOND_ENERGY',
            'SECOND_BUSY',
            'SECOND_ERROR',
            'SECOND_SPAWNING',
            'SECOND_END',
            
            'THIRD_BEGIN',
            'THIRD_ENERGY',
            'THIRD_BUSY',
            'THIRD_ERROR',
            'THIRD_SPAWNING',
            'THIRD_END',
            
            'STATES_END'
        ]), (v) => +v);
        intention.memory.state = intention.memory.state || intention.STATES.STATES_BEGIN;
        
        let stateHandled = false;
        
        
        // TODO: work out a way to associate colony to spawn
        colony.spawn = Game.spawns[Object.keys(Game.spawns)[0]];
        // TODO: maybe not count this every time, and only use the creeps in the colony
        colony.creeps = _.map(_.filter(Game.creeps, (creep) => !creep.spawning));

        let sources = colony.spawn.room.find(FIND_SOURCES_ACTIVE);
        
        let creepMatchers = {
            harvesters: (b) => b.move > 0 && b.work > 0,
            haulers:    (b) => b.move > 0 && b.work > 0 && b.carry > 0,
            builders:   (b) => b.move > 0 && b.work > 0 && b.carry > 0,
        };
        
        let creeps = {
            harvesters: [],
            haulers:    [],
            builders:   [],
        };

        let creepPool = {
            add: function(role, creep) {
                let pools = creepPool._pools = creepPool._pools || {};
                role = Array.isArray(role) ? role : [role];
                role.forEach((role) => {
                    pools[role] = pools[role] || [];
                    pools[role].push(creep);
                });
            },
            remove: function(creep) {
                let pools = creepPool._pools;
                creep = Array.isArray(creep) ? creep : [creep];
                if (pools) {
                    pools.forEach((pool, role) => {
                        let index = pool.indexOf(harvester);
                        pool.splice(index, 1);
                        if (!pool.length) {
                            delete pools[role];
                        }
                    });
                }
            },
            // Returns up to count creeps to fill given role
            assign: function(role, count) {
                let assigned = [];
                let pools = creepPool._pools;
                if (pools && pools[role]) {
                    assigned = pools[role].splice(0, count);
                    creeps[role] = creeps[role].concat(assigned);
                    if (!pools[role].length) {
                        delete pools[role];
                    }
                    assigned.forEach((creep) => creepPool.remove(creep));
                }
                return assigned;
            }
        };
        
        colony.creeps.forEach((creep) => {
            let body = {
                move:  creep.getActiveBodyparts(MOVE),
                carry: creep.getActiveBodyparts(CARRY),
                work:  creep.getActiveBodyparts(WORK),
            };
            // Check which roles it satisfies
            let roles = [];
            _.forEach(creepMatchers, (creepMatcher, role) => {
                if (creepMatcher(body)) {
                    roles.push(role);
                }
            });
            // If it satisfies multiple roles, pool it for later assignment
            if (roles > 1) {
                creepPool.add(roles, creep);
            // If it only satisfies one role, assign it to that role
            } else if (roles) {
                let list = creeps[roles[0]] = creeps[roles[0]] || [];
                list.push(creep);
            }
        });

        // Begin intent implementation =========================================

        // First priority: at least one harvester; we can do nothing without input
        // ---------------------------------------------------------------------
        if (!stateHandled) {

            let minHarvesters = 1,
                missingHarvesters = Math.max(0, minHarvesters - creeps.harvesters.length);

            // Try to acquire required creeps from pool
            if (missingHarvesters > 0) {
                creeps.harvesters = creeps.harvesters.concat(
                    creepPool.assign('harvesters', missingHarvesters)
                );
                missingHarvesters = Math.max(0, minHarvesters - creeps.harvesters.length);
            }

            if (missingHarvesters > 0) {
            
                stateHandled = true;
    
                if (intention.memory.state < intention.STATES.FIRST_BEGIN
                    || intention.memory.state > intention.STATES.FIRST_END
                ) {
                    intention.memory.state = intention.STATES.FIRST_BEGIN;
                    console.log('<span style="color:lightseagreen">', 'Initialize: Colony has no harvesters!', '</span>');
                }
    
                // Define initial harvester
                let body = [MOVE,CARRY,WORK,WORK],
                    name = undefined;

                // Spawn if we have enough energy
                if (intention.memory.state !== intention.FIRST_SPAWNING) {

                    let cost = body.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);

                    if (cost > colony.spawn.energyCapacity) {

                        if (intention.memory.state !== intention.STATES.FIRST_COST) {
                            intention.memory.state = intention.STATES.FIRST_COST;
                            console.log('<span style="color:lightseagreen">', 'Initialize: Initial harvester too expensive! ', '</span>');
                        }

                    } else {

                        // Give it some direction
                        let memory = { role: 'harvester', colony: colony };

                        // Spawn initial harvester
                        let result = colony.spawn.createCreep(body, name, memory);

                        // Spawn failure!
                        if (result < 0) {

                            // Not enough energy
                            if (result === ERR_NOT_ENOUGH_ENERGY) {

                                if (intention.memory.state !== intention.STATES.FIRST_ENERGY) {
                                    intention.memory.state = intention.STATES.FIRST_ENERGY;
                                    console.log('<span style="color:lightseagreen">', 'Initialize: Saving energy for initial harvester...', '</span>');
                                }

                            // Spawner busy
                            } else if (result === ERR_BUSY) {

                                // if (intention.memory.state !== intention.STATES.FIRST_BUSY) {
                                //     intention.memory.state = intention.STATES.FIRST_BUSY;
                                //     console.log('<span style="color:lightseagreen">', 'Initialize: Spawner busy; waiting to spawn initial harvester...', '</span>');
                                // }

                            // Some error
                            } else {

                                if (intention.memory.state !== intention.STATES.FIRST_ERROR) {
                                    intention.memory.state = intention.STATES.FIRST_ERROR;
                                    console.log('<span style="color:lightseagreen">', 'Initialize: Error spawning initial harvester: ', result, '</span>');
                                }

                            }

                        // Spawn success!
                        } else {

                            if (intention.memory.state < intention.STATES.FIRST_SPAWNING) {
                                intention.memory.state = intention.STATES.FIRST_SPAWNING;
                                console.log('<span style="color:lightseagreen">', 'Initialize: Spawning initial harvester...', '</span>');
                            }

                        }

                    }

                }
                
            }
            
        }

        // Second priority: at least one hauler; without upgrade we lose room
        // ---------------------------------------------------------------------
        if (!stateHandled) {

            let minUpgraders = 1,
                missingUpgraders = Math.max(0, minUpgraders - creeps.haulers.length);

            // Try to acquire required creeps from pool
            if (missingUpgraders > 0) {
                creeps.haulers = creeps.haulers.concat(
                    creepPool.assign('haulers', missingUpgraders)
                );
                missingUpgraders = Math.max(0, missingUpgraders - creeps.haulers.length);
            }

            if (missingUpgraders > 0) {
            
                stateHandled = true;

                if (intention.memory.state < intention.STATES.SECOND_BEGIN
                    || intention.memory.state > intention.STATES.SECOND_END
                ) {
                    intention.memory.state = intention.STATES.SECOND_BEGIN;
                    console.log('<span style="color:lightseagreen">', 'Initialize: Colony has no haulers!', '</span>');
                }
    
                // Define initial hauler
                // let body = [MOVE,CARRY,WORK,WORK],
                let body = [MOVE,CARRY,WORK],
                    name = undefined;

                // Spawn if we have enough energy
                if (intention.memory.state !== intention.SECOND_SPAWNING) {

                    let cost = body.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);

                    if (cost > colony.spawn.energyCapacity) {

                        if (intention.memory.state !== intention.STATES.SECOND_COST) {
                            intention.memory.state = intention.STATES.SECOND_COST;
                            console.log('<span style="color:lightseagreen">', 'Initialize: Initial hauler too expensive! ', '</span>');
                        }

                    } else {

                        // Give it some direction
                        let memory = { role: 'hauler', colony: colony };

                        // Spawn initial hauler
                        let result = colony.spawn.createCreep(body, name, memory);

                        // Spawn failure!
                        if (result < 0) {

                            // Not enough energy
                            if (result === ERR_NOT_ENOUGH_ENERGY) {

                                if (intention.memory.state !== intention.STATES.SECOND_ENERGY) {
                                    intention.memory.state = intention.STATES.SECOND_ENERGY;
                                    console.log('<span style="color:lightseagreen">', 'Initialize: Saving energy for initial hauler...', '</span>');
                                }

                            // Spawner busy
                            } else if (result === ERR_BUSY) {
                                //
                                // if (intention.memory.state !== intention.STATES.SECOND_BUSY) {
                                //     intention.memory.state = intention.STATES.SECOND_BUSY;
                                //     console.log('<span style="color:lightseagreen">', 'Initialize: Spawner busy; waiting to spawn initial hauler...', '</span>');
                                // }

                            // Some error
                            } else {

                                if (intention.memory.state !== intention.STATES.SECOND_ERROR) {
                                    intention.memory.state = intention.STATES.SECOND_ERROR;
                                    console.log('<span style="color:lightseagreen">', 'Initialize: Error spawning initial hauler: ', result, '</span>');
                                }

                            }

                        // Spawn success!
                        } else {

                            if (intention.memory.state < intention.STATES.SECOND_SPAWNING) {
                                intention.memory.state = intention.STATES.SECOND_SPAWNING;
                                console.log('<span style="color:lightseagreen">', 'Initialize: Spawning initial hauler...', '</span>');
                            }

                        }

                    }

                }

            }
            
        }
            
        // Third priority: at least one builder; without walls we're vulnerable
        // ---------------------------------------------------------------------
        if (!stateHandled) {

            let minBuilders = 1,
                missingBuilders = Math.max(0, minBuilders - creeps.builders.length);

            // Try to acquire required creeps from pool
            if (missingBuilders > 0) {
                creeps.builders = creeps.builders.concat(
                    creepPool.assign('builders', missingBuilders)
                );
                missingBuilders = Math.max(0, missingBuilders - creeps.builders.length);
            }
            
            if (missingBuilders > 0) {

                stateHandled = true;
            
                if (intention.memory.state < intention.STATES.THIRD_BEGIN
                    || intention.memory.state > intention.STATES.THIRD_END
                ) {
                    intention.memory.state = intention.STATES.THIRD_BEGIN;
                    console.log('<span style="color:lightseagreen">', 'Initialize: Colony has no builders!', '</span>');
                }
    
                // Define initial builder
                let body = [MOVE,CARRY,WORK,WORK],
                    name = undefined;

                // Spawn if we have enough energy
                if (intention.memory.state !== intention.THIRD_SPAWNING) {

                    let cost = body.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);

                    if (cost > colony.spawn.energyCapacity) {

                        if (intention.memory.state !== intention.STATES.THIRD_COST) {
                            intention.memory.state = intention.STATES.THIRD_COST;
                            console.log('<span style="color:lightseagreen">', 'Initialize: Initial builder too expensive! ', '</span>');
                        }

                    } else {

                        // Give it some direction
                        let memory = { role: 'builder', colony: colony };

                        // Spawn initial builder
                        let result = colony.spawn.createCreep(body, name, memory);

                        // Spawn failure!
                        if (result < 0) {

                            // Not enough energy
                            if (result === ERR_NOT_ENOUGH_ENERGY) {

                                if (intention.memory.state != intention.STATES.THIRD_ENERGY) {
                                    intention.memory.state = intention.STATES.THIRD_ENERGY;
                                    console.log('<span style="color:lightseagreen">', 'Initialize: Saving energy for initial builder...', '</span>');
                                }

                            // Spawner busy
                            } else if (result === ERR_BUSY) {

                                // if (intention.memory.state !== intention.STATES.THIRD_BUSY) {
                                //     intention.memory.state = intention.STATES.THIRD_BUSY;
                                //     console.log('<span style="color:lightseagreen">', 'Initialize: Spawner busy; waiting to spawn initial builder...', '</span>');
                                // }

                            // Some error
                            } else {
                                if (intention.memory.state !== intention.STATES.THIRD_ERROR) {
                                    intention.memory.state = intention.STATES.THIRD_ERROR;
                                    console.log('<span style="color:lightseagreen">', 'Initialize: Error spawning initial builder: ', result, '</span>');
                                }
                            }

                        // Spawn success!
                        } else {

                            if (intention.memory.state < intention.STATES.THIRD_SPAWNING) {
                                intention.memory.state = intention.STATES.THIRD_SPAWNING;
                                console.log('<span style="color:lightseagreen">', 'Initialize: Spawning initial builder...', '</span>');
                            }

                        }

                    }

                }

            }
                    
        }
        
        // Run assigned tasks
        colony.creeps.forEach(function(creep) {
            // debugger;
            creep.run(colony);
        });
        
    },
     
    exit: function(enterIntent) {
        
    }
    
};