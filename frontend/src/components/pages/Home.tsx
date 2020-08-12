import React, { useState, useEffect } from 'react';
import MainTemplate from '../templates/Main';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, makeStyles } from '@material-ui/core'

type HostInfo = {
    id: number,
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

const Home: React.FC = () => {
    window.document.title = 'Home - ghost';

    const classes = useStyles();
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

    return (
        <MainTemplate title='Home'>
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
        </MainTemplate>
    )
};

export default Home;