module.exports = {
    
    name: 'build',
    
    enter: function(exitTask) {
        
    },
    
    run: function(task, opts) {

        let creep = this;

        let defaultTask = creep.roles[creep.memory.role].defaultTask,
            $opts = _.propertyOf(opts),
            target = $opts('target');
        // Find a source
        if (target === undefined) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
                ignoreCreeps: true
            });
        }
        // Go after it
        if (target) {
            let result = creep.attack(target);
            if (result < OK) {
                switch (result) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(target);
                        break;
                    default:
                        creep.setTask($opts('task.error') || defaultTask);
                        console.log('Unknown error while defending', result);
                        break;
                }
            }
        }

    },
     
    exit: function(enterTask) {
        
    }
    
};
