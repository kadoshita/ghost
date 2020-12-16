export type HostInfo = {
    ID: number,
    active: boolean,
    hostname: string,
    ipaddress: string,
    os: string,
    core: number,
    ram: number,
    disk: number,
    type: number,
    online: boolean,
    HostType: HostType,
    note: string
};
export type HostType = {
    ID: number,
    hosttype: string
};