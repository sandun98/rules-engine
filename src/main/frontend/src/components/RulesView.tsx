import React, {useEffect, useState} from 'react';

import {createStyles, makeStyles, Theme,withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import {Dialog, IconButton, Typography} from "@material-ui/core";
import RuleDetail from "./RuleDetail";
import {API,Order} from "./common/utils";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Toolbar from "@material-ui/core/Toolbar";

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


const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.common.white,
        }

    }),
)(TableCell);
function EnhancedTableHead(props: EnhancedTableProps) {
    const {classes, order, orderBy, onRequestSort} = props;
    const createSortHandler = (property: keyof Rule) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <StyledTableCell
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
                    </StyledTableCell>
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
        },
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
    const [count, setCount] = React.useState(0);


    useEffect(() => {
        findRules();
    }, [page,rowsPerPage,orderBy,order]);

    const findRules = () => {

        fetch(API + 'rules/'+page+'/'+rowsPerPage+'/'+orderBy+'/'+order, {headers: {'Content-Type': 'application/json'}})
            .then(response => response.json()).then(results => {
                setRows(results.rows);
                setCount(results.count)
            }).catch(reason => alert(reason));
    }

    const saveRule = (data: Rule) => {
        fetch(API + 'rules', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                setOpen(false);
            })
            .catch(error => alert(error));
    }

    const handleDelete = (event: React.MouseEvent<unknown>, data: Rule) => {

        if (window.confirm('Are you sure you want to delete?'))
            deleteRule(data.id);

    };
    const deleteRule = (id: number) => {
        fetch(API + 'rules/' + id, {
            method: 'DELETE',
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => alert(error));
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



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Rules
                </Typography>
                <IconButton aria-label="delete" size={"small"} edge={"end"} onClick={(event) => handleClick(event,  {
                    id: 0,
                    description: '',
                    namespace: '',
                    action: '',
                    condition: ''
                })}>
                    <AddIcon/>
                </IconButton>
            </Toolbar>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        size={'small'}
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={count}
                            onSelectAllClick={(e) => console.log(e.bubbles)}/>
                        <TableBody>
                            {
                                rows.map((row, index) => {
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
                                                <IconButton aria-label="delete" size={"small"}>
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
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={(e,page)=> handleChangePage(e,page)}
                    onChangeRowsPerPage={handleChangeRowsPerPage}

                />
            </Paper>


            <Dialog
                fullWidth={true}
                open={open}
                onClose={handleClose}
            >
                {selectedRow && <RuleDetail rule={selectedRow} onSave={saveRule} onClose={handleClose}/>}
            </Dialog>
        </React.Fragment>
    );
}
