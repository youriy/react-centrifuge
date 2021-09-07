import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import StickyHeadTable from "./StickyHeadTable.jsx";
import CircularIndeterminate from "./CircularIndeterminate.jsx";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "fixed",
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
    const classes = useStyles();

    return (
        <div>
            <Dialog
                fullScreen
                open={!!props.open}
                onClose={props.close}
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={props.close}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {props.open}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {props.rows.length > 0 ? (
                    <StickyHeadTable
                        rows={props.rows}
                        columns={props.columns}
                    />
                ) : (
                    <CircularIndeterminate />
                )}
            </Dialog>
        </div>
    );
}
