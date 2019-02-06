"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = (function () {
    function Logger(saveLog) {
        this.saveLog = saveLog;
        this.saveLog = saveLog;
    }
    Logger.prototype.info = function (msg) {
        this.saveLog(msg);
    };
    Logger.prototype.error = function (err) {
        this.saveLog(JSON.stringify(err, null, 2));
    };
    return Logger;
}());
exports.Logger = Logger;
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
exports.guid = guid;
