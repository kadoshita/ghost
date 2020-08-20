import React, { useState, useEffect } from 'react';
import MainTemplate from '../templates/Main';
import { useParams, withRouter } from 'react-router-dom';
import { HostInfo } from '../../types/HostInfo';
import { TableContainer, Paper, makeStyles, Table, TableBody, TableRow, TableCell, IconButton, Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons'
import HostInfoInputDialog from '../dialogs/HostInfoInput';
import { InputHostInfo } from '../../types/InputHostInfo';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const HostInfoDeleteDialog = (props: any) => {
    const handleClose = () => {
        props.handleClose();
    };
    const handleDelete = () => {
        props.handleClose(true);
    };
    return (
        <Dialog open={props.open} onClose={handleClose} aria-label='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>{props.hostname}の情報を削除しますか?</DialogTitle>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>キャンセル</Button>
                <Button onClick={handleDelete} color='primary'>削除</Button>
            </DialogActions>
        </Dialog>
    );
};

const Detail: React.FC = (props: any) => {
    window.document.title = 'Detail - ghost';

    const [hostData, setHostData] = useState<HostInfo>();
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

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

    const handleEditDialogOpen = () => {
        setOpenEditDialog(true);
    };
    const handleEditDialogClose = async (hostInfo: InputHostInfo) => {
        setOpenEditDialog(false)
        const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
        if (hostInfo) {
            const keys = Object.keys(hostInfo);
            if (keys.includes('hostname') && keys.includes('ipaddress') && keys.includes('os') && keys.includes('core') && keys.includes('ram') && keys.includes('disk')) {
                const res = await fetch(`${API_ENDPOINT}/host/${hostData?.ID}`, {
                    method: 'PUT',
                    body: JSON.stringify(hostInfo)
                });
                if (res.status === 200) {
                    const res = await fetch(`${API_ENDPOINT}/host/${hostData?.ID}`);
                    if (res.status === 404) {
                        return;
                    }
                    const resJson = await res.json();
                    setHostData(resJson);
                }
            }
        }
    };
    const handleDeleteDialogOpen = () => {
        setOpenDeleteDialog(true);
    };
    const handleDeleteDialogClose = (deleteData = false) => {
        setOpenDeleteDialog(false);
        if (deleteData) {
            const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api';
            const deleteHostData = async () => {
                const res = await fetch(`${API_ENDPOINT}/host/${hostData?.ID}`, {
                    method: 'DELETE'
                });
                if (res.status === 200) {
                    props.history.push('/');
                }
            };
            deleteHostData();
        }
    };
    const titleBarButtonList = [
        <IconButton
            key={0}
            color='inherit'
            aria-label='delete data'
            onClick={handleDeleteDialogOpen}
            edge='end'>
            <Delete></Delete>
        </IconButton>,
        <IconButton
            key={1}
            color='inherit'
            aria-label='edit data'
            onClick={handleEditDialogOpen}
            edge='end'>
            <Edit></Edit>
        </IconButton>
    ];

    return (
        <MainTemplate title={hostData ? `Detail - ${hostData.hostname}` : 'Detail - NotFound'} titleBarButtons={titleBarButtonList}>
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
                            <TableCell component='th' scope='row'>Type</TableCell>
                            <TableCell>{hostData ? hostData.type : '-'}</TableCell>
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
            <HostInfoDeleteDialog open={openDeleteDialog} hostname={hostData?.hostname} handleClose={handleDeleteDialogClose}></HostInfoDeleteDialog>
            <HostInfoInputDialog open={openEditDialog} hostname={hostData?.hostname} active={hostData?.active} ipaddress={hostData?.ipaddress} os={hostData?.os} core={hostData?.core} ram={hostData?.ram} disk={hostData?.disk} type={hostData?.type} handleClose={handleEditDialogClose}></HostInfoInputDialog>
        </MainTemplate>
    );
};

export default withRouter(Detail);