import { UUID } from "./src/global/UUID";
// yes
declare global {
    namespace NodeJS {
        interface Global {
            UUID: UUID;
        }
    }
}

export {};
