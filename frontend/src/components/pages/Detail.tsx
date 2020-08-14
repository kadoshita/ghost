import React, { useState, useEffect } from 'react';
import MainTemplate from '../templates/Main';
import { useParams } from 'react-router-dom';
import { HostInfo } from '../../types/HostInfo';
import { TableContainer, Paper, makeStyles, Table, TableBody, TableRow, TableCell } from '@material-ui/core';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const Detail: React.FC = () => {
    window.document.title = 'Detail - ghost';

    const [hostData, setHostData] = useState<HostInfo>();

    const { id } = useParams();
    const classes = useStyles();

    useEffect(() => {
        const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
        const fetchHostsData = async () => {
            const res = await fetch(`${API_ENDPOINT}/host/${id}`);
            if (res.status === 404) {
                return;
            }
            const resJson = await res.json();
            setHostData(resJson);
        };
        fetchHostsData();
    }, [id]);

    return (
        <MainTemplate title={hostData ? `Detail - ${hostData.hostname}` : 'Detail - NotFound'}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='host info table'>
                    <TableBody>
                        <TableRow>
                            <TableCell component='th' scope='row'>ID</TableCell>
                            <TableCell>{hostData ? hostData.ID : '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component='th' scope='row'>Active</TableCell>
                            <TableCell>{hostData ? (hostData.active ? 'Active' : 'InActive') : '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component='th' scope='row'>HostName</TableCell>
                            <TableCell>{hostData ? hostData.hostname : '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component='th' scope='row'>IP Address</TableCell>
                            <TableCell>{hostData ? hostData.ipaddress : '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component='th' scope='row'>CPU Core</TableCell>
                            <TableCell>{hostData ? hostData.core : '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component='th' scope='row'>RAM&nbsp;(MB)</TableCell>
                            <TableCell>{hostData ? hostData.ram : '-'} MB</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component='th' scope='row'>Disk&nbsp;(GB)</TableCell>
                            <TableCell>{hostData ? hostData.disk : '-'} GB</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </MainTemplate>
    );
};

export default Detail;