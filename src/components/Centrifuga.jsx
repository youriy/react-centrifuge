import React from "react";
import Centrifuge from "centrifuge";
import MetricList from "./MetricsList.jsx";

const centrifuge = new Centrifuge("wss://secret");

class Centrifuga extends React.Component {
    /**
     * Канал для работы с centrifuge
     * @type {string}
     */
    channel = "secret";

    /**
     * Токен для установки соединения с centrifuge
     * @type {string}
     */
    jwt = "secret";

    /**
     * Текущее соединение с центрифугой
     * @type {Centrifuge}
     */
    centrifuge;

    /**
     * Хранилище для метрики
     * @type {Map}
     */
    metricMap;

    /**
     * Хранилище для таймаута, оповещающего о проблеме с центрифугой
     * @type {number}
     */
    timeout;

    /**
     * Количество ошибок
     * @type {int}
     */
    errorsCount;

    constructor(props) {
        super(props);
        this.errorsCount = 0;
        this.metricMap = new Map();
        this.centrifuge = this.setConnection(this.channel, this.jwt);
        this.state = { items: null };
    }

    setItems(data) {
        for (let row = 0; row < data.length; row++) {
            for (let element = 0; element < data[row].length; element++) {
                let obj = data[row][element];
                obj.row = row;
                obj.time = Date.now();
                this.metricMap.set(data[row][element].code, data[row][element]);
            }
        }

        this.setState({ items: this.getItems() });
    }

    getItems() {
        let metrics = [];
        let now = Date.now();
        this.errorsCount = 0;

        for (let it of this.metricMap.values()) {
            if (metrics[it.row] === undefined) {
                metrics[it.row] = [];
            }

            if (now - it.time > 5 * 60 * 1000) {
                it.status = "secondary";
            }

            if (it.status === "error") {
                this.errorsCount++;
            }

            metrics[it.row].push(it);
        }

        return metrics;
    }

    /**
     * Если в течении 5 минут небыло публикаций, делает все кубики серыми
     */
    setTimerSecondary() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.setState({ items: this.getItems() });
        }, 5 * 60 * 1000);
    }

    setConnection(channel, jwt) {
        centrifuge.setToken(jwt);
        centrifuge.subscribe(channel, (centdata) => {
                this.setItems(centdata.data);
                this.setTimerSecondary();
            })
            .on("join", function (e) {
                console.log("join", e);
            })
            .on("leave", function (e) {
                console.log("leave", e);
            })
            .on("unsubscribe", function (e) {
                console.log("unsubscribe", e);
            })
            .on("subscribe", function (e) {
                console.log("subscribe", e);
            })
            .on("connect", function (data) {
                console.log("connect", data);
            })
            .on("message", function (data) {
                console.log("message", data);
            })
            .on("disconnect", function (data) {
                console.log("disconnect", data);
            });

        centrifuge.connect();

        return centrifuge;
    }

    getConnection() {
        return this.centrifuge;
    }

    render() {
        if (this.state.items === null) {
            return false;
        }

        return (
            <MetricList
                items={this.state.items}
                centrifuga={this.getConnection()}
                errors={this.errorsCount}
            />
        );
    }
}

export default Centrifuga;
