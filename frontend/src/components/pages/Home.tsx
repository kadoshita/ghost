import React, { useState, useEffect } from 'react';
import MainTemplate from '../templates/Main';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, makeStyles, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core'

type HostInfo = {
    id: number,
    hostname: string,
    ipaddress: string,
    os: string,
    core: number,
    ram: number,
    disk: number
};
type InputHostInfo = {
    hostname: string,
    ipaddress: string,
    os: string,
    core: number,
    ram: number,
    disk: number
};
const useStyles = makeStyles({
    table: {
        minWidth: 650
    }
});

const HostInfoInputDialog = (props: any) => {
    const [hostName, setHostName] = useState<string>('');
    const [ipAddress, setIpAddress] = useState<string>('');
    const [os, setOs] = useState<string>('');
    const [core, setCore] = useState<number>(1);
    const [ram, setRam] = useState<number>(1024);
    const [disk, setDisk] = useState<number>(32);
    const formItemList = [
        { id: 'hostname', label: 'HostName', default: '', type: 'text', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setHostName(e.target.value) },
        { id: 'ipaddress', label: 'IP Address', default: '', type: 'text', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setIpAddress(e.target.value) },
        { id: 'os', label: 'OS', default: '', type: 'text', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setOs(e.target.value) },
        { id: 'core', label: 'CPU Core', default: 1, type: 'number', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setCore(parseInt(e.target.value, 10)) },
        { id: 'ram', label: 'RAM (MB)', default: 1024, type: 'number', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setRam(parseInt(e.target.value, 10)) },
        { id: 'disk', label: 'Disk (GB)', default: 32, type: 'number', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setDisk(parseInt(e.target.value, 10)) }
    ];
    const handleClose = () => {
        const hostInfo: InputHostInfo = {
            hostname: hostName,
            ipaddress: ipAddress,
            os: os,
            core: core,
            ram: ram,
            disk: disk
        };
        if (hostName !== '' && ipAddress !== '' && os !== '' && core > 0 && ram > 0 && disk > 0) {
            props.handleClose(hostInfo);
            setHostName('');
            setIpAddress('');
            setOs('');
            setCore(1);
            setRam(1024);
            setDisk(32);
        } else {
            console.warn('error');
        }
    };
    return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>ホスト情報登録</DialogTitle>
            <DialogContent>
                {formItemList.map((f, i) => (<TextField
                    key={i}
                    autoFocus={i === 0}
                    margin='dense'
                    id={f.id}
                    label={f.label}
                    type={f.type}
                    fullWidth
                    required
                    defaultValue={f.default}
                    onChange={f.onchange}
                >
                </TextField>))}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>キャンセル</Button>
                <Button onClick={handleClose} color='primary'>登録</Button>
            </DialogActions>
        </Dialog>
    )
}

const Home: React.FC = () => {
    window.document.title = 'Home - ghost';

    const classes = useStyles();
    const [open, setOpen] = useState<boolean>(false);
    const [hostData, setHostData] = useState<HostInfo[]>([]);

    useEffect(() => {
        const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
        const fetchHostsData = async () => {
            const res = await fetch(`${API_ENDPOINT}/host/`);
            const resJson = await res.json();
            setHostData(resJson);
        };
        fetchHostsData();
    }, []);

    const handleAddDialogOpen = () => {
        setOpen(true);
    };
    const handleHostInfoInputDialogClose = (hostInfo: InputHostInfo) => {
        setOpen(false);
        const keys = Object.keys(hostInfo);
        if (keys.includes('hostname') && keys.includes('ipaddress') && keys.includes('os') && keys.includes('core') && keys.includes('ram') && keys.includes('disk')) {
            console.log(hostInfo);
        }
    }

    return (
        <MainTemplate title='Home' showAddButton handleAddDialogOpen={handleAddDialogOpen}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='hosts table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>HostName</TableCell>
                            <TableCell align='right'>IP Address</TableCell>
                            <TableCell align='right'>OS</TableCell>
                            <TableCell align='right'>CPU Core</TableCell>
                            <TableCell align='right'>RAM&nbsp;(MB)</TableCell>
                            <TableCell align='right'>Disk&nbsp;(GB)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hostData.map(host => (
                            <TableRow key={host.hostname}>
                                <TableCell component='th' scope='row'>
                                    {host.id}
                                </TableCell>
                                <TableCell>{host.hostname}</TableCell>
                                <TableCell align='right'>{host.ipaddress}</TableCell>
                                <TableCell align='right'>{host.os}</TableCell>
                                <TableCell align='right'>{host.core}</TableCell>
                                <TableCell align='right'>{host.ram}</TableCell>
                                <TableCell align='right'>{host.disk}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <HostInfoInputDialog open={open} handleClose={handleHostInfoInputDialogClose}></HostInfoInputDialog>
        </MainTemplate>
    )
};

export default Home;