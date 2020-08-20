export type InputHostInfo = {
    active: boolean,
    hostname: string,
    ipaddress: string,
    os: string,
    core: number,
    ram: number,
    disk: number,
    type: 'server' | 'router' | 'virtual machine'
};