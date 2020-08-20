export type HostInfo = {
    ID: number,
    active: boolean,
    hostname: string,
    ipaddress: string,
    os: string,
    core: number,
    ram: number,
    disk: number,
    type: HostType
};
export type HostType = 'server' | 'router' | 'virtual machine';