import React, {Fragment, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Rule} from "./RulesView";
import {AppBar, Button, DialogActions, DialogContent, Grid, TextareaAutosize} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        text: {
            font: 'Inherit'
        }
    }),
);

interface IProps {
    rule: Rule;
    onSave: Function;
    onClose: Function;
}

export default function RuleDetail(props: IProps) {
    const classes = useStyles();
    const {rule, onClose, onSave} = props;

    const handleClose = () => {
        onClose();
    };

    const [description, setDescription] = useState<string>(rule.description);
    const [namespace, setNamespace] = useState<string>(rule.namespace);
    const [action, setAction] = useState<string>(rule.action);
    const [condition, setCondition] = useState<string>(rule.condition);
    return (
        <Fragment>
            <AppBar className={classes.appBar}>
                <Toolbar>

                    <Typography variant="h6" className={classes.title}>
                        {description}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <form noValidate autoComplete="off">
                    <Grid className={classes.root}>
                        <TextField id="outlined-basic" label="Rule Namespace" value={namespace} onChange={event => {
                            const {value} = event.target;
                            setNamespace(value);
                        }}/>
                    </Grid>
                    <Grid className={classes.root}>
                        <TextField id="filled-basic" label="Description" onChange={event => {
                            const {value} = event.target;
                            setDescription(value);
                        }} value={description}/>
                    </Grid>


                    <table width={"100%"} cellPadding={3}>
                        <thead>
                        <th align={"left"}>When (condition)</th>
                        <th align={"left"}>Then (action)</th>
                        </thead>
                        <tbody>

                        <tr>
                            <td width={'50%'}><TextareaAutosize rowsMin={18} className={classes.text}
                                                                placeholder="When (condition)" style={{width: '100%'}}
                                                                value={condition}

                                                                onChange={event => {
                                                                    const {value} = event.target;
                                                                    setCondition(value);
                                                                }}/>
                            </td>
                            <td width={'50%'}><TextareaAutosize rowsMin={18} placeholder="Then (action)"
                                                                className={classes.text}
                                                                style={{width: '100%'}} value={action}
                                                                onChange={event => {
                                                                    const {value} = event.target;
                                                                    setAction(value);
                                                                }}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={
                    onSave(
                        {
                            id: props.rule.id,
                            description: description,
                            namespace: namespace,
                            action: action,
                            condition: condition
                        }
                    )
                } color="primary">
                    Save
                </Button>
            </DialogActions>
        </Fragment>
    );
}
