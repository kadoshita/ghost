import React, { useEffect, useState } from 'react';
import MainTemplate from '../templates/Main';
import { TextField, FormControl, List, ListItem, ListItemText, Divider, makeStyles, Button, Grid } from '@material-ui/core';
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

    const [typeList, setTypeList] = useState<HostType[]>([{ ID: 0, hosttype: '' }]);

    useEffect(() => {
        const getHostTypeList = async () => {
            const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
            const res = await fetch(`${API_ENDPOINT}/setting/hosttype`);
            const resJson = await res.json();
            setTypeList(resJson.map((d: { hosttype: string; ID: number; }) => ({ ID: d.ID, hosttype: d.hosttype })));
        };
        getHostTypeList();
    }, []);

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
                                InputLabelProps={{
                                    shrink: true,
                                }}>
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                        <Button color='primary' fullWidth variant='contained'>保存</Button>
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
                                InputLabelProps={{
                                    shrink: true,
                                }}></TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                        <Button color='primary' fullWidth variant='contained'>保存</Button>
                    </Grid>
                </Grid>
                <List component='nav' aria-label='host type list'>
                    {typeList.map((t, i) => (
                        <ListItem key={i}>
                            <ListItemText primary={t.hosttype}></ListItemText>
                        </ListItem>
                    ))}
                </List>
            </form>
        </MainTemplate>
    );
};

export default Setting;