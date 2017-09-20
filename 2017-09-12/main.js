var config = require('config');
var $config = _.propertyOf(config);
var log = require('log');

// Extend Game
require('game');
// Extend Creep
require('creep');

// Instance of Colony (later it should be the proto and it be added to global)
var colony = require('colony');

// Example buffered log
log.log('1');

// Should replace these later with something nice
console.error = console.warn = console.info = console.log;

config.$constants = _.invert(config.constants);

module.exports.loop = function() {

    // For now we'll use a single colony for all rooms, but in the future
    // we may need multiple colonies with their own grouped rooms and spawns
    colony.rooms  = Game.rooms;
    colony.spawns = Game.spawns;
    
    // Run the only colony
    colony.run();
    
    // Log output
    log.dump();
    var time = Game.time;
    console.log(_.pad(` Tick: ${time} `, 80, '-'));
    
    
    console.log('<h1>', 'wtf', '</h1>');
    
};