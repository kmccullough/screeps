module.exports = {
    
    name: 'build',
    
    enter: function(exitTask) {
        
    },
    
    run: function(task, opts) {

        var creep = this,
            defaultTask = creep.roles[creep.memory.role].defaultTask,
            $opts = _.propertyOf(opts);
        if (!_.sum(creep.carry)) {
            creep.setTask($opts('task.empty') || defaultTask);
        } else {
            let target = $opts('target');
            // Find a source
            if (target === undefined) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    ignoreCreeps: true,
                    filter: {
                        structureType: STRUCTURE_CONTROLLER,
                        my:    true,
                        owner: null
                    }
                });
            }
            // Go after it
            if (target) {
                let result = creep.build(target);
                if (result < OK) {
                    switch (result) {
                        case ERR_NOT_IN_RANGE:
                            creep.moveTo(target);
                            break;
                        case ERR_INVALID_TARGET:
                            creep.setTask($opts('task.error') || defaultTask);
                            console.log('Invalid target while building', target);
                            break;
                        default:
                            creep.setTask($opts('task.error') || defaultTask);
                            console.log('Unknown error while building', result);
                            break;
                    }
                }
            }
        }
        
    },
     
    exit: function(enterTask) {
        
    }
    
};
