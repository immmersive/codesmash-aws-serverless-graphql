"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUID = void 0;
class UUID {
    static getUuid() {
        return require('uuid').v4();
    }
}
exports.UUID = UUID;
