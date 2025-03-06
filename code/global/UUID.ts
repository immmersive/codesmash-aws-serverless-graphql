export class UUID 
{ 
    static getUuid(): string 
    { 
        return require('uuid').v4()
    } 
}
