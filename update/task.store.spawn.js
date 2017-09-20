module.exports = {
    
    name: 'build',
    
    enter: function(exitTask) {
        
    },
    
    run: function(task, opts) {

        let creep = this;
        let defaultTask = creep.roles[creep.memory.role].defaultTask,
            $opts = _.propertyOf(opts);
        if (!_.sum(creep.carry)) {
            creep.setTask($opts('task.empty') || defaultTask);
        } else {
            let target = $opts('target');
            // Find a source
            if (target === undefined) {
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    ignoreCreeps: true,
                    filter: (o) => (
                            o.structureType == STRUCTURE_SPAWN
                            || o.structureType == STRUCTURE_EXTENSION
                            || o.structureType == STRUCTURE_CONTAINER
                            || o.structureType == STRUCTURE_STORAGE
                        ) && o.energy < o.energyCapacity
                });
            }
            // Go after it
            if (target) {
                let result = creep.transfer(target, RESOURCE_ENERGY);
                if (result < OK) {
                    switch (result) {
                        case ERR_NOT_IN_RANGE:
                            creep.moveTo(target);
                            break;
                        case ERR_FULL:
                            creep.setTask($opts('task.full') || defaultTask);
                            console.log('Spawner/extension full');
                            break;
                        default:
                            creep.setTask($opts('task.error') || defaultTask);
                            console.log('Unkown error harvesting', result);
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
