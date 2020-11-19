import React, { useState, useEffect } from 'react';
import MainTemplate from '../templates/Main';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, makeStyles, IconButton, Grid } from '@material-ui/core'
import { Check, Add, FiberManualRecord } from '@material-ui/icons';
import Charts from 'react-apexcharts';
import { HostInfo } from '../../types/HostInfo';
import { withRouter } from 'react-router-dom';
import HostInfoInputDialog from '../dialogs/HostInfoInput';
import { InputHostInfo } from '../../types/InputHostInfo';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles({
    table: {
        minWidth: 650
    }
});

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
            if (keys.includes('hostname') && keys.includes('ipaddress') && keys.includes('os') && keys.includes('core') && keys.includes('ram') && keys.includes('disk') && keys.includes('type')) {
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
            <Grid container>
                <Grid item xs={2}>
                    <Charts
                        type='pie'
                        series={[
                            hostData.filter(h => h.online).length,
                            hostData.filter(h => !h.online).length
                        ]}
                        options={{
                            labels: ['Online', 'Offline'],
                            colors: ['#00E396', '#FF4560'],
                            tooltip: {
                                enabled: false
                            }
                        }}
                    ></Charts>
                </Grid>
                <Grid item xs={2}>
                    <Charts
                        type='pie'
                        series={[
                            hostData.filter(h => h.active).length,
                            hostData.filter(h => !h.active).length
                        ]}
                        options={{
                            labels: ['Active', 'InActive'],
                            colors: ['#00E396', '#FF4560'],
                            tooltip: {
                                enabled: false
                            }
                        }}
                    ></Charts>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='hosts table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Online</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>HostName</TableCell>
                            <TableCell align='right'>IP Address</TableCell>
                            <TableCell align='right'>Type</TableCell>
                            <TableCell align='right'>OS</TableCell>
                            <TableCell align='right'>CPU Core</TableCell>
                            <TableCell align='right'>RAM&nbsp;(MB)</TableCell>
                            <TableCell align='right'>Disk&nbsp;(GB)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hostData.map(host => (
                            <TableRow key={host.hostname} onClick={() => handleTableRowClick(host.ID)} hover style={{ cursor: 'pointer' }}>
                                <TableCell>
                                    {host.online ? <FiberManualRecord style={{ color: green[500] }}></FiberManualRecord> : <FiberManualRecord style={{ color: red[600] }}></FiberManualRecord>}
                                </TableCell>
                                <TableCell component='th' scope='row'>
                                    {host.ID}
                                </TableCell>
                                <TableCell>
                                    {host.active ? <Check style={{ color: green[500] }}></Check> : <></>}
                                </TableCell>
                                <TableCell>{host.hostname}</TableCell>
                                <TableCell align='right'>{host.ipaddress}</TableCell>
                                <TableCell align='right'>{host.HostType.hosttype}</TableCell>
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