export type HostInfo = {
    ID: number,
    active: boolean,
    hostname: string,
    ipaddress: string,
    os: string,
    core: number,
    ram: number,
    disk: number,
    type: HostType,
    online: boolean
};
export type HostType = 'server' | 'router' | 'virtual machine';