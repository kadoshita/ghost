import React, { useEffect, useState } from 'react';
import MainTemplate from '../templates/Main';
import { withRouter } from 'react-router-dom';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { ArrowUpward, ArrowDownward } from '@material-ui/icons';
import { THistory } from '../../types/History';

const useStyles = makeStyles({
    table: {
        minWidth: 650
    }
});

const History: React.FC = () => {
    window.document.title = 'History - ghost';
    const classes = useStyles();
    const [histories, setHistories] = useState<THistory[]>([]);
    useEffect(() => {
        const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
        const fetchHistoriesData = async () => {
            const res = await fetch(`${API_ENDPOINT}/history/?limit=10`);
            const resJson = await res.json();
            setHistories(resJson);
        };
        fetchHistoriesData();
    }, []);
    return (
        <MainTemplate title='History'>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='hosts table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>UP/DOWN</TableCell>
                            <TableCell>HostName</TableCell>
                            <TableCell align='right'>TimeStamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {histories.map(history => {
                            const timestamp = new Date(history.CreatedAt);
                            return (
                                <TableRow key={history.ID} hover style={{ backgroundColor: history.is_up ? green[500] : red[600] }}>
                                    <TableCell component='th' scope='row' style={{ color: history.is_up ? 'black' : 'white' }}>
                                        {history.ID}
                                    </TableCell>
                                    <TableCell style={{ color: history.is_up ? 'black' : 'white' }}>
                                        {history.is_up ? <ArrowUpward></ArrowUpward> : <ArrowDownward></ArrowDownward>}
                                    </TableCell>
                                    <TableCell style={{ color: history.is_up ? 'black' : 'white' }}>{history.HostInfo.hostname}</TableCell>
                                    <TableCell align='right' style={{ color: history.is_up ? 'black' : 'white' }}>{timestamp.toLocaleString()}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainTemplate>
    );
};

export default withRouter(History);