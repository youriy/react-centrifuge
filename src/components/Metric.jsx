import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import { useSnackbar } from "notistack";

const useStyles = makeStyles({
    root: {
        width: 156,
        height: 134,
        display: "inline-block",
        margin: "0 2px",
        textAlign: "center",
        cursor: "pointer",
    },
    success: {
        backgroundColor: "#28a745",
        transition: "background-color 1s ease",
    },
    warning: {
        backgroundColor: "#ffc107",
        transition: "background-color 1s ease",
    },
    error: {
        backgroundColor: "#dc3545",
        transition: "background-color 1s ease",
    },
    secondary: {
        backgroundColor: "#6c757d",
        transition: "background-color 1s ease",
    },
    action: {
        height: "100%",
    },
    content: {
        padding: 0,
    },
});

function Metric(props) {
    const classes = useStyles();
    let status = classes.root + " " + classes[props.item.status];
    const { enqueueSnackbar } = useSnackbar();

    const showSnackbar = (message, variant) => {
        enqueueSnackbar(message, { variant: variant });
    };

    React.useEffect(() => {
        switch (props.item.status) {
            case "warning":
                showSnackbar(props.item.code + " WARNING!", "warning");
                break;
            case "error":
                showSnackbar(props.item.code + " ERROR!", "error");
                break;
            case "secondary":
                showSnackbar(props.item.code + " - не отвечает!", "error");
                break;
        }
    }, [props.item.status]);

    return (
        <Card className={status} onClick={props.onclick}>
            <CardActionArea className={classes.action}>
                <CardContent className={classes.content}>
                    <Typography variant="h3" component="h2">
                        {props.item.code}
                    </Typography>
                    <Typography
                        variant="body2"
                        component="p"
                        dangerouslySetInnerHTML={{ __html: props.item.title }}
                    />
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default Metric;
