// import {
//     ArcElement,
//     CategoryScale,
//     Chart as ChartJS,
//     Filler,
//     Legend, LinearScale,
//     LineElement,
//     PointElement,
//     Title,
//     Tooltip as TooltipChartJs
// } from "chart.js";
import 'chart.js/auto';
import {Chart} from "react-chartjs-2";
import Card from "@/Components/Widgets/Card";
import {useEffect, useState} from "react";
import {getColor} from "@/helpers";
import tinyColor from 'tinycolor2';

function ChartDoughnut({className, label, height, data = {datasets: []}, ...props}) {

    const [dataChart, setDataChart] = useState({datasets: [], labels: []});

    function getColors(color, loop) {
        const base = getColor(color, 600, true);

        return new Array(loop).fill(base).map(function (color, index) {
            return tinyColor(color).lighten(index * 10).desaturate().toString();
        });

    }

    useEffect(() => {

        if(!data.datasets.length || !data.labels.length) {
            return () => null;
        }

        const labels =  Array.isArray(data.labels) ? data.labels : (typeof data.labels === "string" ? data.labels.split(',') : []);

        const _chartData = {
            ...data,
            labels: labels,
            datasets: data.datasets.map((dataset) => ({
                ...dataset,
                data: typeof dataset.data === 'string' ? dataset.data.split(',') : dataset.data,
                backgroundColor: Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor : getColors(dataset.color, labels.length),
            })),
        }

        setDataChart(_chartData);
    }, [data]);

    return (
        <Card className={`${className ?? ''}`}>
            <Card.Header
                paths={props.paths}
                settingsBtn={props.setModal}
            >
                {label}
            </Card.Header>
            <Card.Body>
                <Chart type="doughnut" data={dataChart}/>
            </Card.Body>
        </Card>
    )
}

export default ChartDoughnut
