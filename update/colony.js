const config = require('config');

let initialized = false;

module.exports = _.extend(config.$('colony'), {
    
    // Initialize memory
    memory: Memory.colony = Memory.colony || {},
    
    run: function() {
        let intention;
        
        // Copy intention name from hash key to property value
        _.forOwn(this.intentions, (intention, name) => intention.name = name);
        
        // We need an intention to work towards!
        if (!this.memory.intention) {
            if (this.defaultIntention) {
                console.warn('The colony is without intent! Switching to default.');
                this.setIntention(this.defaultIntention);
            } else {
                throw 'The colony is without intent! And there is no default!';
            }
        }
        
        // Load current intention
        intention = this.intentions[this.memory.intention];
        if (!intention.run) {
            _.extend(intention, require(intention.module || 'colony.intention.' + intention.name));
        }

        // Initialize intent memory
        intention.memory = intention.memory || (Memory.intention = Memory.intention || {});

        if (!initialized && intention.enter) {
            intention.enter();
        }

        intention.run(this);
    
        initialized = true;
    
    },
    
    getIntention: function() {
        return this.intentions[this.memory.intention];
    },
    
    setIntention: function(intention) {
        
        if (this.intentions[intention]) {
            
            let exitIntention  = this.getIntention(),
                enterIntention = this.intentions[intention];
            
            if (exitIntention && exitIntention.exit) {
                exitIntention.exit(enterIntention);
            }
            
            this.memory.intention = enterIntention.name;

            let intent = _.startCase(enterIntention.name);
            console.log('<span style="color:lightseagreen">', `Intent: ${intent}`, '</span>');

            if (enterIntention.enter) {
                enterIntention.enter(exitIntention);
            }
            
        } else {
            
            if (this.defaultIntention !== intention) {
                console.error(`The desired intent "${intention}" was not found! Switching to default.`);
                this.setIntention(this.defaultIntention);
            } else {
                throw `The default intent "${intention}" was not found!`;
            }
            
        }
        
    },
    
    getMemory: function(path) {
        return path.split('.').reduce((p, c) => p[c] ? p[c] : p[c] = {}, Memory.colony);
    },
    
    // Housekeeping
    cleanMemory: function() {
            
        // TODO: Refer to the colony creeps, not all creeps
        // or better yet handle this elsewhere
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        
    }
    
});