module.exports = {
    
    name: 'build',
    
    enter: function(exitTask) {
        
    },
    
    run: function(task, opts) {
    return;
        let creep = this,
            defaultTask = creep.roles[creep.memory.role].defaultTask,
            $opts = _.propertyOf(opts);
        if (!_.sum(creep.carry)) {
            creep.setTask($opts('task.empty') || defaultTask);
        } else {
            let target = $opts('target');
            // Find a source
            if (target === undefined) {
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    ignoreCreeps: true,
                    filter: { structureType: STRUCTURE_CONTROLLER }
                });
            }
            // Go after it
            if (!target) {
                creep.setTask($opts('task.none') || defaultTask);
            } else {
                let result = creep.transfer(target, RESOURCE_ENERGY);
                if (result < OK) {
                    switch (result) {
                        case ERR_NOT_OWNER:
                            creep.say('EO');
                            console.log('Not owner of ', target);
                            break;
                        case ERR_NOT_IN_RANGE:
                            creep.moveTo(target);
                            break;
                        case ERR_FULL:
                            creep.setTask($opts('task.full') || defaultTask);
                            creep.say('EF');
                            console.log('Room controller full');
                            break;
                        default:
                            creep.setTask($opts('task.error') || defaultTask);
                            creep.say('E' + result);
                            console.log('Unkown error while upgrading', result);
                    }
                }
            }
        }
        
    },
     
    exit: function(enterTask) {
        
    }
    
};
