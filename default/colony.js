var config = require('config');

module.exports = _.extend(config.$('colony'), {
    
    run: function() {
        var intention;
        
        // Initialize memory
        if (!this.memory) {
            this.memory = Memory.colony = {};
        }
        
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
        
        // Load and run the current intention
        intention = this.intentions[this.memory.intention];
        if (!intention.run) {
            _.extend(intention, require(intention.module || 'colony.intention.' + intention.name));
        }
        intention.run(this);
    
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

            let verb = enterIntention.verb || enterIntention.name + 'ing';
            console.info(`Colony now intent on ${verb}`);

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