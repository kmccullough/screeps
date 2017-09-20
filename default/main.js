var config = require('config');
var log = require('log');

// Extend Creep
require('creep');

// Instance of Colony (later it should be the proto and it be added to global)
var colony = require('colony');

// Should replace these later with something nice
console.error = console.warn = console.info = console.log;


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
    
    // Later do fancy stuff, like create log windows and graphics
    // console.log('<h1>', 'wtf', '</h1>');
    
};