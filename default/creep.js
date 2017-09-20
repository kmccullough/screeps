var config = require('config');

_.extend(Creep, {
    roles: config.requireCollection('creep.roles'),
    tasks: config.requireCollection('creep.tasks'),
});

_.extend(Creep.prototype, {
    roles: config.$('Creep.roles'),
    tasks: config.$('Creep.tasks'),
    directionToCardinal: function(direction) {
        var result;
        switch (direction) {
            case TOP:          result = 'N';  break;
            case TOP_RIGHT:    result = 'NE'; break;
            case RIGHT:        result = 'E';  break;
            case BOTTOM_RIGHT: result = 'SE'; break;
            case BOTTOM:       result = 'S';  break;
            case BOTTOM_LEFT:  result = 'SW'; break;
            case LEFT:         result = 'W';  break;
            case TOP_LEFT:     result = 'NW'; break;
            default:
                console.log(`Unknown direction "${direction}"`);
        }
        return result;
    },
    $move: Creep.prototype.move,
    move: function(direction) {
        if (config.$('debug.Creep.move')) {
            console.log(`Moving ${this.memory.role} ${this} ${this.directionToCardinal(direction)}`);
        }
        return this.$move.apply(this, arguments);
    },
    moveTo: Creep.prototype.moveTo,
    _moveTo: function(target, opts) {
        var creep  = this,
            move   = this.$move,
            moveTo = this.$moveTo;
            
        var result = OK,
            path,
            prefix = `Cannot move {this.memory.role} ${this}. `,
            opt = arguments.length - 1;
            
        arguments[opt] = _.extend({}, arguments[opt], {
            ignoreCreeps: true
        });

        path = creep.pos.findPathTo.apply(this.pos, [].slice.call(arguments, 0));

        if (path.length) {
            result = this.move(path[0].direction);
        }
        
        if (result < OK) {
            switch (result) {
                case ERR_NOT_OWNER:
                    console.log(prefix + 'You are not the owner of this creep.');
                    break;
                case ERR_BUSY:
                    //console.log(prefix + 'The creep is still being spawned.');
                    break;
                case ERR_TIRED:
                    //console.log(prefix + 'The fatigue indicator of the creep is non-zero.');
                    // this.say('(˘o˘ )');
                    this.say("\u{1f634}");
                    break;
                case ERR_NO_BODYPART:
                    //console.log(prefix + 'There are no MOVE body parts in this creep’s body.');
                    this.say("What is MOVE?");
                    break;
                case ERR_INVALID_TARGET:
                    console.log(prefix + 'The target provided is invalid:', JSON.stringify(arguments[0]));
                    this.say('Do what now?');
                    break;
                case ERR_NO_PATH:
                    //console.log(prefix + 'No path to the target could be found.');
                    this.say("Can't get there!");
                    break;
                default:
                    console.log(prefix + 'Unkown error:', result);
                    this.say('WTF?!');
            }
        }
        
        return result;
    },
    
    run: function() {
        
        let creep = this,
            role = Creep.roles[creep.memory.role];

        if (!role) {
            console.log('Creep', creep, 'is without role to Creep::run');
        }

        // Run role
        if (role && _.isFunction(role.run)) {
            // Returns false to skip task
            if (role.run(creep) === false) {
                return; // RETURN
            }
        }

        let task = Creep.tasks[creep.memory.task];

        if (!task) {
            console.log('Creep', creep, 'is without task to Creep::run');
        }

        // Run task
        if (task && _.isFunction(task.run)) {
            let opts;
            if (role) {
                let $role = _.propertyOf(role);
                opts = _.defaultsDeep({},
                    $role(`tasks.${task.name}`),
                    $role('tasks.default')
                );
            }
            task.run(creep, opts);
        }
        
    },
    
    canChangeRole: function(role, displayErrors) {
        
        if (!role || !_.isString(role)) {
            displayErrors && console.log('Creep::canChangeRole expected role got', role);
            return; // RETURN
        }

        if (!Creep.roles[role]) {
            displayErrors && console.log('Creep::canChangeRole got unknown role', role);
            return; // RETURN
        }

        if (false) { // Fails criteria
            displayErrors && console.log('Creep::canChangeRole fails criteria for role', role);
            return false; // RETURN
        }
        
        return true;

    },
    
    changeRole: function(role) {

        let creep = this;
            
        if (!creep.canChangeRole(role, true /* displayErrors */)) {
            return; // RETURN
        }

        let oldRole = Creep.roles[creep.memory.role],
            newRole = Creep.roles[role];

        if (_.isFunction(oldRole.exit)) {
            oldRole.exit(creep, newRole);
        }
        
        creep.memory.role = role;
        
        if (_.isFunction(newRole.enter)) {
            newRole.enter(creep, oldRole);
        }

    },
    
    canChangeTask: function(task, displayErrors) {
        
        if (!task || !_.isString(task)) {
            displayErrors && console.log('Creep::canChangeTask expected task got', task);
            return; // RETURN
        }

        if (!Creep.tasks[task]) {
            displayErrors && console.log('Creep::canChangeTask got unknown task', task);
            return; // RETURN
        }

        if (false) { // Fails criteria
            displayErrors && console.log('Creep::canChangeTask fails criteria for task', task);
            return false; // RETURN
        }
        
        return true;

    },
    
    changeTask: function(task) {

        let creep = this;
            
        if (!creep.canChangeTask(task, true /* displayErrors */)) {
            return; // RETURN
        }
        
        let oldTask = Creep.tasks[creep.memory.task],
            newTask = Creep.tasks[task];

        if (_.isFunction(oldTask.exit)) {
            oldTask.exit(creep, newTask);
        }
        
        creep.memory.task = task;
        
        if (_.isFunction(newTask.enter)) {
            newTask.enter(creep, oldTask);
        }

    },
    
    runTask: function() {
        var creep = this,
            role = creep.roles[creep.memory.role],
            taskName = creep.memory.task;
        if (!taskName || !creep.tasks[taskName]) {
            this.setTask(taskName = role.defaultTask);
        }
        let task = creep.tasks[taskName];
        if (task) {
            if (!task.$module) {
                task.$module = require(task.module);
            }
            try {
                task.$module.run.call(creep, task, role.tasks[taskName]);
            } catch (e) {
                this.setTask(taskName = role.defaultTask);
            }
        } else {
            console.log(`Could not find task ${taskName}`);
        }
    },
    
    setTask: function(taskName) {
        // var arrow = "\u21e8";
        var arrow = "\u21e2";
        var creep = this,
            oldTask = creep.tasks[creep.memory.task] || {
                short: '?',
                verb: 'performing an unknown task'
            },
            task = creep.tasks[taskName];
        if (task) {
            if (creep.memory.task) {
                creep.say(`${oldTask.short}${arrow}${task.short}`);
                console.log(`${creep.memory.role} ${creep} went from ${oldTask.verb} to ${task.verb}`);
            } else {
                creep.say(`?${arrow}${task.short}`);
                console.log(`${creep.memory.role} ${creep} went from doing jack shit to ${task.verb}`);
            }

            if (oldTask) {
                try {
                    oldTask.$module.exit.call(creep, task);
                } catch (e) {}
            }
            if (!task.$module) {
                task.$module = require(task.module);
            }
            
            try {
                task.$module.enter.call(creep, oldTask);
            } catch (e) {}

            creep.memory.task = taskName;
        }
    },
    
    $createCreep: Creep.prototype.createCreep,
    // createCreep: function() {
        
    // },
    
    run: function(colony) {
        var creep = this,
            role = creep.roles[creep.memory.role],
            taskName = creep.memory.task;
        if (!taskName || !creep.tasks[taskName]) {
            this.setTask(taskName = role.defaultTask);
        }
        let task = creep.tasks[taskName];
        if (task) {
            if (!task.$module) {
                task.$module = require(task.module);
            }
            try {
                task.$module.run.call(creep, task, role.tasks[taskName]);
            } catch (e) {
                this.setTask(taskName = role.defaultTask);
            }
        } else {
            console.log(`Could not find task ${taskName}`);
        }
    },
    
});



