import React, { useState, useEffect } from 'react';
import MainTemplate from '../templates/Main';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, makeStyles, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Switch, FormControlLabel, IconButton } from '@material-ui/core'
import { Check, Add } from '@material-ui/icons';
import { HostInfo } from '../../types/HostInfo';
import { withRouter } from 'react-router-dom';

type InputHostInfo = {
    active: boolean,
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
    const [active, setActive] = useState<boolean>(false);
    const [hostName, setHostName] = useState<string>('');
    const [hostNameInputError, setHostNameInputError] = useState<string>('');
    const [ipAddress, setIpAddress] = useState<string>('');
    const [ipAddressInputError, setIpAddressInputError] = useState<string>('');
    const [os, setOs] = useState<string>('');
    const [osInputError, setOsInputError] = useState<string>('');
    const [core, setCore] = useState<number>(1);
    const [coreInputError, setCoreInputError] = useState<string>('');
    const [ram, setRam] = useState<number>(1024);
    const [ramInputError, setRamInputError] = useState<string>('');
    const [disk, setDisk] = useState<number>(32);
    const [diskInputError, setDiskInputError] = useState<string>('');
    const formItemList = [
        { id: 'hostname', label: 'HostName', default: '', type: 'text', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setHostName(e.target.value), error: hostNameInputError },
        { id: 'ipaddress', label: 'IP Address', default: '', type: 'text', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setIpAddress(e.target.value), error: ipAddressInputError },
        { id: 'os', label: 'OS', default: '', type: 'text', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setOs(e.target.value), error: osInputError },
        { id: 'core', label: 'CPU Core', default: 1, type: 'number', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setCore(parseInt(e.target.value, 10)), error: coreInputError },
        { id: 'ram', label: 'RAM (MB)', default: 1024, type: 'number', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setRam(parseInt(e.target.value, 10)), error: ramInputError },
        { id: 'disk', label: 'Disk (GB)', default: 32, type: 'number', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setDisk(parseInt(e.target.value, 10)), error: diskInputError }
    ];
    const handleClose = () => {
        props.handleClose();
        setHostName('');
        setIpAddress('');
        setOs('');
        setCore(1);
        setRam(1024);
        setDisk(32);
        setHostNameInputError('');
        setIpAddressInputError('')
        setOsInputError('');
        setCoreInputError('');
        setRamInputError('');
        setDiskInputError('');
    };
    const handleSubmit = () => {
        const hostInfo: InputHostInfo = {
            active: active,
            hostname: hostName,
            ipaddress: ipAddress,
            os: os,
            core: core,
            ram: ram,
            disk: disk
        };

        let isError = false;

        if (hostName === '') {
            setHostNameInputError('HostNameを入力してください');
            isError = true;
        } else {
            setHostNameInputError('');
        }

        if (ipAddress === '') {
            setIpAddressInputError('IP Addressを入力してください');
            isError = true;
        } else {
            setIpAddressInputError('')
        }

        if (os === '') {
            setOsInputError('OSを入力してください');
            isError = true;
        } else {
            setOsInputError('');
        }

        if (core <= 0) {
            setCoreInputError('CPU Coreは1以上の数値を入力してください');
            isError = true;
        } else {
            setCoreInputError('');
        }

        if (ram <= 0) {
            setRamInputError('RAMは1以上の数値を入力してください');
            isError = true;
        } else {
            setRamInputError('');
        }

        if (disk <= 0) {
            setDiskInputError('Diskは1以上の数値を入力してください');
            isError = true;
        } else {
            setDiskInputError('');
        }

        if (!isError) {
            props.handleClose(hostInfo);
            setHostName('');
            setIpAddress('');
            setOs('');
            setCore(1);
            setRam(1024);
            setDisk(32);
        }
    }
    return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>ホスト情報登録</DialogTitle>
            <DialogContent>
                <FormControlLabel
                    control={
                        <Switch
                            checked={active}
                            onChange={e => setActive(e.target.checked)}
                            color='primary'
                            name='active'></Switch>}
                    label={active ? 'Active' : 'InActive'}></FormControlLabel>
                {formItemList.map((f, i) => (<TextField
                    key={i}
                    error={f.error !== ''}
                    helperText={f.error}
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
                <Button onClick={handleSubmit} color='primary'>登録</Button>
            </DialogActions>
        </Dialog>
    )
}

const Home: React.FC = (props: any) => {
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
    const handleHostInfoInputDialogClose = async (hostInfo: InputHostInfo) => {
        setOpen(false);
        const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
        if (hostInfo) {
            const keys = Object.keys(hostInfo);
            if (keys.includes('hostname') && keys.includes('ipaddress') && keys.includes('os') && keys.includes('core') && keys.includes('ram') && keys.includes('disk')) {
                console.log(hostInfo);
                const res = await fetch(`${API_ENDPOINT}/host/`, {
                    method: 'POST',
                    body: JSON.stringify(hostInfo)
                });
                if (res.status === 200) {
                    console.log('submit complete');
                    const res = await fetch(`${API_ENDPOINT}/host/`);
                    const resJson = await res.json();
                    setHostData(resJson);
                }
            }
        }
    };
    const handleTableRowClick = (id: number) => {
        props.history.push(`/detail/${id}`);
    };

    const titleBarButtonList = [
        <IconButton
            key={0}
            color='inherit'
            aria-label='add data'
            onClick={handleAddDialogOpen}
            edge='end'>
            <Add></Add>
        </IconButton>
    ];

    return (
        <MainTemplate title='Home' titleBarButtons={titleBarButtonList}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='hosts table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Active</TableCell>
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
                            <TableRow key={host.hostname} onClick={() => handleTableRowClick(host.ID)} hover>
                                <TableCell component='th' scope='row'>
                                    {host.ID}
                                </TableCell>
                                <TableCell>
                                    {host.active ? <Check></Check> : <></>}
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

export default withRouter(Home);