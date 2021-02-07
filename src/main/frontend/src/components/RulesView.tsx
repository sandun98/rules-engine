import React, {useEffect, useState} from 'react';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';

import {Dialog, IconButton, Slide, Typography} from "@material-ui/core";
import RuleDetail from "./RuleDetail";
import {API, getComparator, Order, stableSort} from "./common/utils";
import {TransitionProps} from "@material-ui/core/transitions";
import DeleteIcon from '@material-ui/icons/Delete';

export interface Rule {
    id: number;
    description: string;
    namespace: string;
    action: string;
    condition: string
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Rule;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    {id: 'id', numeric: true, disablePadding: false, label: '#'},

    {id: 'description', numeric: false, disablePadding: true, label: 'Description'},

    {id: 'namespace', numeric: false, disablePadding: false, label: 'Namespace'},

    {id: 'id', numeric: false, disablePadding: false, label: ''},

];

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Rule) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {classes, order, orderBy, onRequestSort} = props;
    const createSortHandler = (property: keyof Rule) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>

                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {},
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    }),
);


export default function RulesView() {
    const classes = useStyles();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Rule>('id');
    const [selected, setSelected] = useState<number[]>([]);
    const [selectedRow, setSelectedRow] = useState<Rule>();
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState<Array<Rule>>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        findRules();

    }, []);

    const findRules = () => {
        fetch(API+'rules',{ headers: {'Content-Type': 'application/json'}})
            .then(response => response.json())
            .then(rules => {
                setRows(rules);
            }).catch(reason => alert(reason));
    }

    const saveRule = (data:Rule) => {

        fetch(API+'rules',{method: 'POST',body: JSON.stringify(data),headers: {'Content-Type': 'application/json'}})
            .then(response => setOpen(false))
            .catch(reason => alert(reason));
    }

    const deleteRule = (id: number) => {


        fetch(API+'rules/' + id, {
            method: 'DELETE',
            body:'raw',
            redirect: 'follow',
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Rule) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    const handleClick = (event: React.MouseEvent<unknown>, data: Rule) => {

        setSelectedRow(data);
        let newSelected: number[] = [];
        newSelected.push(data.id);
        setSelected(newSelected);
        setOpen(true);
    };
    const handleDelete = (event: React.MouseEvent<unknown>, data: Rule) => {

        if (window.confirm('Are you sure you want to delete?'))
            deleteRule(data.id);

    };


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const Transition = React.forwardRef(function Transition(
        props: TransitionProps & { children?: React.ReactElement },
        ref: React.Ref<unknown>,
    ) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    return (
        <React.Fragment>
            <Typography align={"center"} variant={"h5"}>Rules</Typography>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'small'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            onSelectAllClick={(e) => console.log(e.bubbles)}/>
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover

                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                        >

                                            <TableCell align="right">{row.id}</TableCell>

                                            <TableCell onClick={(event) => handleClick(event, row)} component="th"
                                                       id={labelId} scope="row" padding="none">
                                                {row.description}
                                            </TableCell>
                                            <TableCell onClick={(event) => handleClick(event, row)}
                                                       align="left">{row.namespace}</TableCell>
                                            <TableCell align="left" onClick={(event) => handleDelete(event, row)}>
                                                <IconButton aria-label="delete">
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 33 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>


            <Dialog
                fullWidth={true}
                open={open}
                onClose={handleClose}
                aria-labelledby="max-width-dialog-title"
            >
                {selectedRow && <RuleDetail rule={selectedRow} onSave={saveRule} open={open} onClose={handleClose}/>}
            </Dialog>
        </React.Fragment>
    );
}
