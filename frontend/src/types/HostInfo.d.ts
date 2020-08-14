import { types } from "util";

export type HostInfo = {
    ID: number,
    active: boolean,
    hostname: string,
    ipaddress: string,
    os: string,
    core: number,
    ram: number,
    disk: number
};