export type HostInfo = {
    ID: number,
    active: boolean,
    hostname: string,
    ipaddress: string,
    os: string,
    core: number,
    ram: number,
    disk: number,
    type: 'server' | 'router' | 'virtual machine'
};