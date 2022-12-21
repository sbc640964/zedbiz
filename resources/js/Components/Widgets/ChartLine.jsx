import {useEffect, useRef, useState} from "react";
import {
    CategoryScale,
    Chart as ChartJS, Filler, Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip as TooltipChartJs
} from "chart.js";
import {Chart} from "react-chartjs-2";
import Card from "@/Components/Widgets/Card";
import {getColor} from "@/helpers";
import {twMerge} from "tailwind-merge";

function ChartLine({className, height, label, data = {datasets: []}, ...props}) {

    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({datasets: [], labels: []});

    const registrable = [TooltipChartJs, Legend, Title, Filler, LineElement, PointElement, CategoryScale, LinearScale];

    ChartJS.register(...registrable);

    function gradiant(ctx, area, color) {
        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.8, color);
        return gradient;
    }

    useEffect(() => {
        if (!chartRef.current) {
            return () => null;
        }

        const _chartData = {
            ...data,
            labels: Array.isArray(data.labels) ? data.labels : (typeof data.labels === "string" ? data.labels.split(',') : []),
            datasets: data.datasets.map((dataset) => ({
                ...dataset,
                data: typeof dataset.data === 'string' ? dataset.data.split(',') : dataset.data,
                borderColor: getColor(dataset.color, 600, true),
                fill: {
                    ...(dataset?.fill ?? {}),
                    target: dataset.fill?.target ?? 'origin',
                    above: gradiant(chartRef.current.ctx, chartRef.current.chartArea, dataset.fill?.above ?? getColor(dataset.color, 100, true)),
                } ,
                tension: dataset.tension ?? 0.5,
            })),
        }

        setChartData(_chartData);
    }, [data]);

    return(
        <Card className={twMerge('h-96 p-3 w-full', className ?? '')}>
            <Card.Header paths={props.paths} settingsBtn={props.setModal}>
                {label}
            </Card.Header>
            <Card.Body>
                <Chart
                    ref={chartRef}
                    type="line"
                    datasetIdKey='id'
                    options={{
                        maintainAspectRatio: false,
                        interaction: {
                            mode: 'index',
                        },
                        tooltips: {
                            mode: 'point',
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false,
                                },
                                border: {
                                    display: false,
                                }
                            },
                            y: {
                                border: {
                                    display: false,
                                },
                                // grid: {
                                //     display: false,
                                // },
                                ticks: {
                                    display: true,
                                    color: 'rgba(0, 0, 0, 0.5)',
                                    font: {

                                    },
                                    padding: 10,
                                    callback: function(value, index, values) {
                                        return value + ' ₪';
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false,
                            }
                        }
                    }}
                    data={chartData}
                />
            </Card.Body>
        </Card>
        // <div className={`${width ?? 'w-full'} ${height ?? 'h-60'} p-3`}>
        //     <div className="bg-white shadow-xl shadow-zinc-200 rounded-lg h-full flex flex-col">
        //         <HeaderWidget label={label}/>
        //         <div className="flex-grow">
        //             <div className="p-6 pt-3 h-full">
        //                 <div className="w-full h-full">
        //
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default ChartLine
