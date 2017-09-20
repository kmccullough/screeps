const config = require('config');
const log = require('log');

// Extend Creep
require('creep');

// Instance of Colony (later it should be the proto and it be added to global)
const colony = require('colony');

// Should replace these later with something nice
console.error = console.warn = console.info = console.log;


console.log('<span style="color:lightsalmon">', 'Policy: Peace', '</span>');

module.exports.loop = function() {

    // For now we'll use a single colony for all rooms, but in the future
    // we may need multiple colonies with their own grouped rooms and spawns
    colony.rooms  = Game.rooms;
    colony.spawn = Game.spawns[Object.keys(Game.spawns)[0]];
    
    // Run the only colony
    colony.run();
    
    // Log output 
    log.dump();
    var time = Game.time;
    console.log(_.pad(` Tick: ${time} `, 80, '-'));
    
    // Later do fancy stuff, like create log windows and graphics
    // console.log('<h1>', 'wtf', '</h1>');
    
};