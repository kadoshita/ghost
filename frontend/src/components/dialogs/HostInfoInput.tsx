import React, { useState, useEffect } from 'react';
import { InputHostInfo } from '../../types/InputHostInfo';
import { HostType } from '../../types/HostInfo';
import { Dialog, DialogTitle, DialogContent, FormControlLabel, TextField, DialogActions, Button, Switch, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

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
    const [type, setType] = useState<number>(0);
    const [typeList, setTypeList] = useState<HostType[]>([{ ID: 0, hosttype: '' }]);
    const formItemList = [
        { id: 'hostname', label: 'HostName', default: props.hostname, type: 'text', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setHostName(e.target.value), error: hostNameInputError },
        { id: 'ipaddress', label: 'IP Address', default: props.ipaddress, type: 'text', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setIpAddress(e.target.value), error: ipAddressInputError },
        { id: 'os', label: 'OS', default: props.os, type: 'text', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setOs(e.target.value), error: osInputError },
        { id: 'core', label: 'CPU Core', default: props.core || 1, type: 'number', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setCore(parseInt(e.target.value, 10)), error: coreInputError },
        { id: 'ram', label: 'RAM (MB)', default: props.ram || 1024, type: 'number', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setRam(parseInt(e.target.value, 10)), error: ramInputError },
        { id: 'disk', label: 'Disk (GB)', default: props.disk || 32, type: 'number', onchange: (e: React.ChangeEvent<HTMLInputElement>) => setDisk(parseInt(e.target.value, 10)), error: diskInputError }
    ];
    const handleClose = () => {
        props.handleClose();
        setHostName('');
        setIpAddress('');
        setOs('');
        setCore(1);
        setRam(1024);
        setDisk(32);
        setType(0);
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
            disk: disk,
            type: type
        };

        let isError = false;

        if (!hostName || hostName === '') {
            setHostNameInputError('HostNameを入力してください');
            isError = true;
        } else {
            setHostNameInputError('');
        }

        if (!ipAddress || ipAddress === '') {
            setIpAddressInputError('IP Addressを入力してください');
            isError = true;
        } else {
            setIpAddressInputError('')
        }

        if (!os || os === '') {
            setOsInputError('OSを入力してください');
            isError = true;
        } else {
            setOsInputError('');
        }

        if (!core || core <= 0) {
            setCoreInputError('CPU Coreは1以上の数値を入力してください');
            isError = true;
        } else {
            setCoreInputError('');
        }

        if (!ram || ram <= 0) {
            setRamInputError('RAMは1以上の数値を入力してください');
            isError = true;
        } else {
            setRamInputError('');
        }

        if (!disk || disk <= 0) {
            setDiskInputError('Diskは1以上の数値を入力してください');
            isError = true;
        } else {
            setDiskInputError('');
        }

        if (!isError) {
            props.handleClose(hostInfo);
        }
    }

    useEffect(() => {
        if (props.active !== undefined) {
            setActive(props.active);
        }
    }, [props.active]);
    useEffect(() => {
        if (props.hostname !== undefined) {
            setHostName(props.hostname);
        }
    }, [props.hostname]);
    useEffect(() => {
        if (props.ipaddress !== undefined) {
            setIpAddress(props.ipaddress);
        }
    }, [props.ipaddress]);
    useEffect(() => {
        if (props.os !== undefined) {
            setOs(props.os);
        }
    }, [props.os]);
    useEffect(() => {
        if (props.core !== undefined) {
            setCore(props.core);
        }
    }, [props.core]);
    useEffect(() => {
        if (props.ram !== undefined) {
            setRam(props.ram);
        }
    }, [props.ram]);
    useEffect(() => {
        if (props.disk !== undefined) {
            setDisk(props.disk);
        }
    }, [props.disk]);
    useEffect(() => {
        if (props.type !== undefined) {
            setType(props.type);
        }
    }, [props.type]);
    useEffect(() => {
        const getHostTypeList = async () => {
            const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
            const res = await fetch(`${API_ENDPOINT}/setting/hosttype`);
            const resJson = await res.json();
            setTypeList(resJson.map((d: { hosttype: string; ID: number; }) => ({ ID: d.ID, hosttype: d.hosttype })));
            setType(resJson[0].ID);
        };
        getHostTypeList();
    }, []);
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
                <FormControl fullWidth>
                    <InputLabel id="host-type">Type</InputLabel>
                    <Select
                        labelId="host-type"
                        id="host-type-select"
                        value={type || typeList[0].ID}
                        onChange={e => setType(e.target.value as number)}
                    >
                        {typeList?.map((h, i) => (
                            <MenuItem key={i} value={h.ID} selected={(type === h.ID || i === 0)}>{h.hosttype}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>キャンセル</Button>
                <Button onClick={handleSubmit} color='primary'>登録</Button>
            </DialogActions>
        </Dialog>
    )
};

export default HostInfoInputDialog;