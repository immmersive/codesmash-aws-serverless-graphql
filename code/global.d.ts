import { UUID } from './global/UUID';
// yes
declare global {
    namespace NodeJS {
        interface Global {
            UUID: UUID;
        }
    }
}

export {};
