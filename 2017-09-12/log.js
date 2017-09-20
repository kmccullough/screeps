module.exports = {
    _log: [],
    log: function(log) {
        this._log.push(log);
        return this;
    },
    dump: function() {
        console.log('Dump:', this._log.reduce((p, log) => {
            return `${p}; ${log}`;
        }, ''));
        this._log = [];
        return this;
    }
};