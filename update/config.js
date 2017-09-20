
const config = module.exports = _.extend({
    
    // Config path accessor; prevents checking properties on undefined
    $: $,
    
    debug: {
        Creep: {
            move: false
        }
    },
    
    cache: {
        priorities: {
            build: 5
        }
    },
    
    priorities: {
        default: {
            // Determines who needs to be spawned more
            spawn: {
                default:        100,
                harvester:      100,
                reloader:       100,
                defender:       100,
                builder:   100,
                // claimer:        0
            },
            // Determines who gives way to another in movement
            move: {
                default: 1,
                harvest: 2,
                upgrade: 3,
                defend: 100
            },
            harvest: {
                criteria: {
                    occupants: 2,
                }
            },
            mule: {
                criteria: {
                    dropped:   100,
                    container: 90,
                    storage:   80,
                    creep:     70,
                    default:   0,
                }
            },
            build: {
                room: {
                    default:      '100%',
                    same:         '100%',
                    different:      '0%',
                    spawn:        '100%',
                    no_spawn:       '0%',
                    completion:      100,
                    // controller_0:   0,
                    // controller_1: 100,
                    // controller_2: 100,
                    // controller_3: 100
                },
                structures: {
                    multiplier:    4,
                    spawn:       100,
                    tower:        95,
                    container:    90,
                    extension:    80,
                    wall:         75,
                    rampart:      70,
                    road:         60,
                    default:      50,
                    // portal:      100,
                    // controller:  100,
                    // link:        100,
                    // storage:     100,
                    // tower:       100,
                    // observer:    100,
                    // power_spawn: 100,
                    // extractor:   100,
                    // lab:         100,
                    // terminal:    100,
                    // container:   100,
                    // nuker:       100
                },
                creeps: {
                    default:        100,
                    // smallHarvester: 100,
                    // largeHarvester: 100,
                    // reloader:       100,
                    // smallUpgrader:  100,
                    // largeUpgrader:  100,
                    // defender:       100,
                    // smallBuilder:   100,
                    // largeBuilder:   100,
                    // claimer:        100
                }
            },
            repair: {
                structures: {
                    spawn:       100,
                    container:   90,
                    road:        85,
                    extension:   80,
                    default:     50,
                    rampart:     10,
                    wall:        9.7,
                    // portal:      100,
                    // controller:  100,
                    // link:        100,
                    // storage:     100,
                    // tower:       100,
                    // observer:    100,
                    // power_spawn: 100,
                    // extractor:   100,
                    // lab:         100,
                    // terminal:    100,
                    // nuker:       100
                },
                creeps: {
                    default:        100,
                    // smallHarvester: 100,
                    // largeHarvester: 100,
                    // reloader:       100,
                    // smallUpgrader:  100,
                    // largeUpgrader:  100,
                    // defender:       100,
                    // smallBuilder:   100,
                    // largeBuilder:   100,
                    // claimer:        100
                }
            }
        },
        initialize: {
            spawn: {
                default:        0,
                smallHarvester: 95,
                largeHarvester: 100,
                largeUpgrader:  90,
                smallUpgrader:  85,
                largeBuilder:   80,
                smallBuilder:   75,
                reloader:       70,
                // defender:       0,
                // claimer:        0
            },
            repair: {
                structures: {
                }
            }
        }
    },
    spawn: {
        default:        { min:  0 },
        smallHarvester: { min:  1 },
        largeHarvester: { min:  2 },
        mule:           { min:  1 },
        reloader:       { min:  2 },
        smallUpgrader:  { min:  1 },
        largeUpgrader:  { min:  0 },
        defender:       { min:  0 },
        smallBuilder:   { min:  0 },
        largeBuilder:   { min:  1 },
        claimer:        { min:  0 },
    },
    tower: {
        minDefenseEnergy: 200
    },
    colony: {
        defaultIntention: 'initialize',
        // These intentions don't mean the only thing will happen is what's
        // described, but each will have thresholds before another intention is
        // triggered. For example, if enough damage is being dealt to enough
        // creeps and structures it could trigger the defend intention.
        intentions: {
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
            
            initialize: {
                verb: 'initializing'
            },
            fortify: {
            },
            collect: {
            },
            upgrade: {
            },
            defend: {
            },
            explore: {
                verb: 'exploring'
            },
            break: {
                verb: 'taking a break'
            },
            dance: {
                verb: 'stayin alive'
            },
            attack: {
            },
            war: {
                verb: 'warring'
            },
        }
    },
    Creep: {
        defaultRole: 'harvest',
        tasks: {
            haul: {
                name:  'haul',
                verb:  'hauling',
                short: "\u2bc0", // Small square black
                module: 'task.haul'
            },
            mule: {
                name:  'mule',
                verb:  'muling',
                short: "\u2bc0", // Small square black
                module: 'task.mule'
            },
            // steal: {
            //     name:  'steal',
            //     verb:  'stealing',
            //     short: "\u{1f365}", // Fish cake
            //     module: 'task.steal'
            // },
            harvest: {
                name:  'harvest',
                verb:  'harvesting',
                // short: "\u26cf", // pick-axe
                short: "\u{1f69c}", // tractor
                module: 'task.harvest'
            },
            'store.spawn': {
                name:  'store.spawn',
                verb:  'transferring to spawn',
                short: "\u2b24", // Circle black
                shortExtension: "\u25c9", // Circle dot black
                shortContainer: "\u2bc0", // Small square black
                shortUnknown:   "\u2b53", // Right-pointing pentagon black
                module: 'task.store.spawn'
            },
            'store.tower': {
                name:  'store.tower',
                verb:  'reloading tower',
                short:   "\u29ed", // Circle down arrow black
                //shortContainer: "\u2bc0", // Small square black
                module: 'task.store.tower'
            },
            'store.room': {
                name:  'store.room',
                verb:  'transferring to room',
                short:   "\u2b53", // Right-pointing pentagon black
                // short: "\u2bc3", // black octogon
                // short: "\u28fe", // (braille) binary 254
                module: 'task.store.room'
            },
            fight: {
                name:  'fight',
                verb:  'fighting',
                short: "\u2620", // Skull and crossbones
                module: 'task.fight'
            },
            build: {
                name:  'build',
                verb:  'building',
                short: "\u{1f6e0}", // Hammer/wrench
                module: 'task.build'
            },
            claim: {
                name:  'claim',
                verb:  'claiming',
                short: "\u2691",
                module: 'task.claim'
            }
        },
        roles: {
            default: 'harvester',
            harvester: {
                name:   'harvester',
                plural: 'harvesters',
                body:   [MOVE, WORK, WORK, CARRY],
                defaultTask: 'harvest',
                tasks: {
                    harvest: {
                        task: {
                            full:  'store.spawn',
                            error: 'store.spawn'
                        }
                    },
                    'store.spawn': {
                        task: {
                            empty: 'harvest',
                            none:  'store.tower',
                            full:  'store.tower',
                            error: 'store.tower'
                        }
                    },
                    'store.tower': {
                        task: {
                            empty: 'harvest',
                            none:  'store.room',
                            full:  'store.room',
                            error: 'store.room'
                        }
                    },
                    'store.room': {
                        task: {
                            empty: 'harvest',
                            none:  'store.spawn',
                            full:  'store.spawn',
                            error: 'store.spawn'
                        }
                    }
                }
            },
            hauler: {
                name:   'hauler',
                plural: 'haulers',
                body:   [MOVE, WORK, CARRY],
                defaultTask: 'haul',
                tasks: {
                    haul: {
                        task: {
                            none:  'harvest',
                            full:  'store.spawn',
                            error: 'store.spawn'
                        }
                    },
                    harvest: {
                        task: {
                            full:  'store.spawn',
                            error: 'store.spawn'
                        }
                    },
                    'store.spawn': {
                        task: {
                            empty: 'haul',
                            none:  'store.tower',
                            full:  'store.tower',
                            error: 'store.tower'
                        }
                    },
                    'store.tower': {
                        task: {
                            empty: 'haul',
                            none:  'store.room',
                            full:  'store.room',
                            error: 'store.room'
                        }
                    },
                    'store.room': {
                        task: {
                            empty: 'haul',
                            none:  'store.spawn',
                            full:  'store.spawn',
                            error: 'store.spawn'
                        }
                    }
                }
            },

            reloader: {
                name:   'reloader',
                plural: 'reloaders',
                body:   [MOVE, MOVE, WORK, WORK, CARRY, CARRY],
                defaultTask: 'mule',
                tasks: {
                    mule: {
                        task: {
                            full:  'store.tower',
                            none:  'mule',
                            error: 'mule'
                        }
                    },
                    harvest: {
                        task: {
                            full:  'store.tower',
                            error: 'mule'
                        }
                    },
                    'store.tower': {
                        task: {
                            empty: 'mule',
                            none:  'build',
                            full:  'store.spawn',
                            error: 'store.spawn'
                        }
                    },
                    build: {
                        task: {
                            empty: 'mule',
                            none:  'store.tower',
                            error: 'mule'
                        }
                    },
                    'store.spawn': {
                        task: {
                            empty: 'mule',
                            none:  'store.room',
                            full:  'store.room',
                            error: 'store.room'
                        }
                    },
                    'store.room': {
                        task: {
                            empty: 'mule',
                            none:  'store.tower',
                            full:  'store.tower',
                            error: 'store.tower'
                        }
                    }
                }
            },
            smallUpgrader: {
                name:   'smallUpgrader',
                plural: 'smallUpgraders',
                body:   [MOVE, WORK, CARRY],
                defaultTask: 'mule',
                tasks: {
                    mule: {
                        task: {
                            full:  'store.room',
                            none:  'mule',
                            error: 'mule'
                        }
                    },
                    harvest: {
                        task: {
                            full:  'store.room',
                            error: 'mule'
                        }
                    },
                    'store.room': {
                        task: {
                            empty: 'mule',
                            full:  'store.tower',
                            error: 'store.tower'
                        }
                    },
                    'store.tower': {
                        task: {
                            empty: 'mule',
                            none:  'store.spawn',
                            full:  'store.spawn',
                            error: 'store.spawn'
                        }
                    },
                    'store.spawn': {
                        task: {
                            empty: 'mule',
                            full:  'store.room',
                            error: 'store.room'
                        }
                    }
                }
            },
            largeUpgrader: {
                name:   'largeUpgrader',
                plural: 'largeUpgraders',
                body:   [MOVE, MOVE, WORK, WORK, CARRY, CARRY],
                defaultTask: 'mule',
                tasks: {
                    mule: {
                        task: {
                            full:  'store.room',
                            none:  'mule',
                            error: 'mule'
                        }
                    },
                    harvest: {
                        task: {
                            full:  'store.room',
                            error: 'mule'
                        }
                    },
                    'store.room': {
                        task: {
                            empty: 'mule',
                            full:  'store.tower',
                            error: 'store.tower'
                        }
                    },
                    'store.tower': {
                        task: {
                            empty: 'mule',
                            none:  'store.spawn',
                            full:  'store.spawn',
                            error: 'store.spawn'
                        }
                    },
                    'store.spawn': {
                        task: {
                            empty: 'mule',
                            full:  'store.room',
                            error: 'store.room'
                        }
                    }
                }
            },
            defender: {
                name:   'defender',
                plural: 'defenders',
                body: [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK],
                defaultTask: 'fight',
                tasks: {
                    fight: {
                        task: {
                        }
                    }
                }
            },
            smallBuilder: {
                name:   'smallBuilder',
                plural: 'smallBuilders',
                body: [MOVE, WORK, CARRY],
                defaultTask: 'mule',
                tasks: {
                    mule: {
                        task: {
                            full:  'build',
                            none:  'mule',
                            error: 'mule'
                        }
                    },
                    harvest: {
                        task: {
                            full:  'build',
                            error: 'mule'
                        }
                    },
                    build: {
                        task: {
                            empty: 'mule',
                            none:  'store.tower',
                            error: 'mule'
                        }
                    },
                    'store.tower': {
                        task: {
                            empty: 'mule',
                            none:  'store.spawn',
                            full:  'store.spawn',
                            error: 'store.spawn'
                        }
                    },
                    'store.spawn': {
                        task: {
                            empty: 'mule',
                            full:  'store.room',
                            error: 'store.room'
                        }
                    },
                    'store.room': {
                        task: {
                            empty: 'mule',
                            none:  'store.tower',
                            full:  'store.tower',
                            error: 'store.tower'
                        }
                    }
                }
            },
            largeBuilder: {
                name:   'largeBuilder',
                plural: 'largeBuilders',
                body: [MOVE, MOVE, WORK, WORK, CARRY, CARRY],
                defaultTask: 'mule',
                tasks: {
                    mule: {
                        task: {
                            full:  'build',
                            none:  'mule',
                            error: 'mule'
                        }
                    },
                    harvest: {
                        task: {
                            full:  'build',
                            error: 'mule'
                        }
                    },
                    build: {
                        task: {
                            empty: 'mule',
                            none:  'store.tower',
                            error: 'mule'
                        }
                    },
                    'store.tower': {
                        task: {
                            empty: 'mule',
                            none:  'store.spawn',
                            full:  'store.spawn',
                            error: 'store.spawn'
                        }
                    },
                    'store.spawn': {
                        task: {
                            empty: 'mule',
                            full:  'store.room',
                            error: 'store.room'
                        }
                    },
                    'store.room': {
                        task: {
                            empty: 'mule',
                            none:  'store.tower',
                            full:  'store.tower',
                            error: 'store.tower'
                        }
                    }
                }
            },
            claimer: {
                name:   'claimer',
                plural: 'claimers',
                body: [MOVE, CLAIM],
                defaultTask: 'claim',
                tasks: {
                    claim: {
                        task: {
                            error: 'claim'
                        }
                    },
                }
            }
        }
    },
    
    get: function(path, ...params) {
        let result;
        if (_.isFunction(path)) {
            if (params.length) {
                for (let i = 0, p; p = getArrayFromIndex(params, i); ++i) {
                    p = config.get(path(p));
                    if (!_.isUndefined(p)) {
                        result = p;
                        break;
                    }
                }
            }
        } else {
            result = _.propertyOf(config)(path);
        }
        return result;
    },
    
    requireCollection: (key) => {
        let result = $(key) || {};
        _.forEach(result,
            (v, k) => {
                if (!v) {
                    // Nothing there
                } else if (_.isString(v)) {
                    v = require(v);
                } else if (_.isString(v.module)) {
                    v = _.extend(require(v.module), v);
                }
                result[k] = v;
            }
        );
        return result;
    },
    
    // Mapping of config strings to associated screeps constants
    constants: {
        road:        STRUCTURE_ROAD,
        wall:        STRUCTURE_WALL,
        spawn:       STRUCTURE_SPAWN,
        extension:   STRUCTURE_EXTENSION,
        rampart:     STRUCTURE_RAMPART,
        portal:      STRUCTURE_PORTAL,
        controller:  STRUCTURE_CONTROLLER,
        link:        STRUCTURE_LINK,
        storage:     STRUCTURE_STORAGE,
        tower:       STRUCTURE_TOWER,
        observer:    STRUCTURE_OBSERVER,
        power_bank:  STRUCTURE_POWER_BANK,
        power_spawn: STRUCTURE_POWER_SPAWN,
        extractor:   STRUCTURE_EXTRACTOR,
        lab:         STRUCTURE_LAB,
        terminal:    STRUCTURE_TERMINAL,
        container:   STRUCTURE_CONTAINER,
        nuker:       STRUCTURE_NUKER,
    },
    
});


config.$constants = _.invert(config.constants);


function getArrayFromIndex(arrs, index) {
    let overflow = false,
        result = [];
    let values = arrs.reduceRight(
        (p, c) =>
            p.unshift(c.length * p[0]) && p,
        [1]
    );
    if (Math.floor(index / values[0])) {
        result = null;
    } else {
        let remainingIndex = index;
        for (let i = 0; i < arrs.length; ++i) {
            let count = 0;
            if (remainingIndex) {
                let value = values[i + 1];
                count = Math.floor(remainingIndex / value);
                remainingIndex -= count * value;
            }
            result.push(arrs[i][count]);
        }
    }
    return result;
}

// Property accessor function for config object
var $config = _.propertyOf(config);

// Returns $config(path) or $config if path omitted
function $(path) {
    return path ? $config(path) : $config;
}



