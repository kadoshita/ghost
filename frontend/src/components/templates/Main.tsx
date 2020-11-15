import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { Drawer, AppBar, Toolbar, List, CssBaseline, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Menu, ChevronLeft, ChevronRight, Home, Settings, Router } from '@material-ui/icons';

const drawerWidth = 240;

const pageList = [
    { title: 'Home', icon: <Home></Home>, path: '' },
    { title: 'Network', icon: <Router></Router>, path: 'network' },
    { title: 'Settings', icon: <Settings></Settings>, path: 'setting' }
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex'
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        menuButton: {
            marginRight: 36
        },
        title: {
            flexGrow: 1
        },
        addButton: {
            marginLeft: 36
        },
        hide: {
            display: 'none'
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap'
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1
            }
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3)
        }
    })
);

const MainTemplate = (props: any) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position='fixed'
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={handleDrawerOpen}
                        edge='start'
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant='h6' noWrap className={classes.title}>
                        {props.title}
                    </Typography>
                    {props.titleBarButtons}
                </Toolbar>
            </AppBar>
            <Drawer
                variant='permanent'
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose} aria-label='menu open button'>
                        {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {
                        pageList.map((p, i) => (
                            <Link to={`/${p.path}`} key={p.title}>
                                <ListItem button>
                                    <ListItemIcon>{p.icon}</ListItemIcon>
                                    <ListItemText primary={p.title}></ListItemText>
                                </ListItem>
                            </Link>
                        ))
                    }
                </List>
                <Divider />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {props.children}
            </main>
        </div >
    );
}

export default MainTemplate;