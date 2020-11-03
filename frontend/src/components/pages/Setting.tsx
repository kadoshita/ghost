import React, { useEffect, useState } from 'react';
import MainTemplate from '../templates/Main';
import { TextField, FormControl, List, ListItem, ListItemText, Divider, makeStyles, Button, Grid, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { HostType } from '../../types/HostInfo';

const useStyles = makeStyles({
    divider: {
        marginTop: '4px',
        marginBottom: '4px'
    }
});

const Setting: React.FC = () => {
    window.document.title = 'Settings - ghost';

    const classes = useStyles();

    const [newHostType, setNewHostType] = useState('');
    const [typeList, setTypeList] = useState<HostType[]>([{ ID: 0, hosttype: '' }]);
    const [timeoutSetting, setTimeoutSetting] = useState<number>(10);
    const getHostTypeList = async () => {
        const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
        const res = await fetch(`${API_ENDPOINT}/setting/hosttype`);
        const resJson = await res.json();
        setTypeList(resJson.map((d: { hosttype: string; ID: number; }) => ({ ID: d.ID, hosttype: d.hosttype })));
    };
    const getTimeoutSetting = async () => {
        const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
        const res = await fetch(`${API_ENDPOINT}/setting/timeout`);
        const resJson = await res.json();
        setTimeoutSetting(resJson);
    }

    useEffect(() => {
        getHostTypeList();
        getTimeoutSetting();
    }, []);

    const handleClickHostTypeSave = async () => {
        const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
        await fetch(`${API_ENDPOINT}/setting/hosttype`, {
            method: 'POST',
            body: JSON.stringify({
                hosttype: newHostType
            })
        });
        setNewHostType('');
        getHostTypeList();
    };
    const handleClickTimeoutSave = async () => {
        const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
        await fetch(`${API_ENDPOINT}/setting/timeout`, {
            method: 'PUT',
            body: JSON.stringify({
                timeout: timeoutSetting
            })
        });
        getTimeoutSetting();
    };
    const handleClickHostTypeDelete = async (id: number) => {
        const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
        await fetch(`${API_ENDPOINT}/setting/hosttype/${id}`, {
            method: 'DELETE'
        });
        getHostTypeList();
    };

    return (
        <MainTemplate title='Settings'>
            <form>
                <Grid container>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <TextField
                                type='number'
                                inputProps={{
                                    min: '0',
                                    max: '300',
                                    step: '10',
                                    style: {
                                        textAlign: 'right'
                                    }
                                }}
                                label='Onlineタイムアウト時間'
                                name='timeout'
                                fullWidth
                                value={timeoutSetting}
                                onChange={e => setTimeoutSetting(parseInt(e.target.value, 10))}
                                InputLabelProps={{
                                    shrink: true,
                                }}>
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                        <Button color='primary' fullWidth variant='contained' onClick={handleClickTimeoutSave}>保存</Button>
                    </Grid>
                </Grid>
                <Divider className={classes.divider}></Divider>
                <Grid container>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <TextField
                                fullWidth
                                label='ホストタイプ'
                                name='hosttype'
                                value={newHostType}
                                onChange={e => setNewHostType(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}></TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                        <Button color='primary' fullWidth variant='contained' onClick={handleClickHostTypeSave}>保存</Button>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={3}>
                        <List component='nav' aria-label='host type list'>
                            {typeList.map((t, i) => (
                                <ListItem key={i}>
                                    <ListItemText primary={t.hosttype}></ListItemText>
                                    <ListItemSecondaryAction>
                                        <IconButton edge='end' aria-label='delete' onClick={e => handleClickHostTypeDelete(t.ID)}>
                                            <Delete></Delete>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </form>
        </MainTemplate>
    );
};

export default Setting;