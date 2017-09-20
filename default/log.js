
var log = module.exports = {
    
    // Caches given log arguments
    log: function(...logs) {
        log._logs.push(logs);
        return log;
    },
    
    // Dumps log cache to console
    dump: function() {
        console.log('Dump:', log._logs.reduce((p, ls) => {
            ls = ls.reduce((p, l) => {
                return p + (p ? ', ' : '' ) + `${l}`;
            }, '');
            return `${p}; ${ls}`;
        }, ''));
        log._logs = [];
        return log;
    },

    // Private
    _logs: [],
};


