import React from "react";
import Metric from "./Metric.jsx";
import FullScreenDialog from "./FullScreenDialog.jsx";
import { useSnackbar } from "notistack";

function MetricsList(props) {
    const [code, setCode] = React.useState(false);
    const [connection, setConnection] = React.useState(false);
    const [columns, setColumns] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        document.title = `Монитор (errors: ${props.errors})`;
    }, [props.errors]);

    const showSnackbar = (message, variant) => {
        enqueueSnackbar(message, { variant: variant });
    };

    const handleOpen = (code) => {
        setCode(code);
        setConnection(
            props.centrifuga
                .subscribe("secret_" + code)
                .on("unsubscribe", function (e) {
                    console.log("unsubscribe", e);
                    showSnackbar("Отписка от " + code, "info");
                })
                .on("subscribe", function (e) {
                    console.log("subscribe", e);
                    showSnackbar("Подписка на " + code, "info");
                })
                .on("publish", function (data_) {
                    console.log(data_.data);
                    let data = data_.data;
                    let newColumns = [];

                    if (data.columns !== undefined) {
                        for (
                            let column = 0;
                            column < data.columns.length;
                            column++
                        ) {
                            newColumns.push({
                                id: data.columns[column],
                                label: data.columns[column],
                                minWidth: 170,
                            });
                        }
                    }

                    if (columns.length !== newColumns.length) {
                        setColumns(newColumns);
                    }

                    if (data.table === null) {
                        showSnackbar("Нет данных от " + code, "info");
                    }

                    if (
                        data.table !== null &&
                        data.table.length !== rows.length
                    ) {
                        setRows(data.table);
                    }
                })
        );
    };

    const handleClose = () => {
        connection.unsubscribe("secret_" + code);
        setCode(false);
        setColumns([]);
        setRows([]);
    };

    return [
        <div key="1" className="content">
            {props.items.map(function (row, index) {
                let hr = index > 0 ? <hr key={index} className="hr" /> : "";

                return [
                    hr,
                    row.map(function (it) {
                        return (
                            <Metric
                                key={it.code}
                                item={it}
                                onclick={() => handleOpen(it.code)}
                            />
                        );
                    }),
                ];
            })}
        </div>,
        <FullScreenDialog
            key="2"
            close={() => handleClose()}
            open={code}
            connection={connection}
            rows={rows}
            columns={columns}
        />,
    ];
}

export default MetricsList;
