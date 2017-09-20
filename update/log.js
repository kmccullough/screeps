
const log = module.exports = {
    
    // TODO: Work in progress
    // Appends new named log window to given log window parent
    register: function(name, parent) {
        if (name && !log._windows[name]) {
            
            let layout = parent ? parent.layout : log._layout;

            // Store name accessible window
            log._windows[name] = {
                name:   name,
                parent: parent,
                layout: []
            };
            
            log._windows[name] = {
                name:   name,
                parent: parent,
                layout: []
            };
            
        }
    },
    
    // Caches given log arguments
    log: function(...logs) {
        log._logs.push(logs);
        return log;
    },
    
    // Dumps log cache to console
    dump: function() {
        if (log._logs.length) {
            console.log('Dump:', log._logs.reduce((p, ls) => {
                ls = ls.reduce((p, l) => {
                    return p + (p ? ', ' : '' ) + `${l}`;
                }, '');
                return `${p}; ${ls}`;
            }, ''));
        }
        log._logs = [];
        return log;
    },

    // Private
    _windows: {},
    _layout: [],
    _logs: [],
};


