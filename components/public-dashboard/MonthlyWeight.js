import ReactECharts from 'echarts-for-react';
import { usePublicWeight } from '../../hooks/queries';

export default function MonthlyWeight() {

    const weightQuery = usePublicWeight()
    const weight = weightQuery.status == 'success' ? weightQuery.data : []

    const options = {
        textStyle: {
            fontFamily: "Oswald"
        },
        legend: { show: true },
        tooltip: {
            trigger: 'item'
        },
        xAxis: {
            type: 'category',
            data: weight.map((item) => item["month_year"])
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: weight.map((item) => item["plasticoduro"] + item["pet"] + item["galones"]),
                type: 'bar',
                name: 'Libras mensuales',
                color: '#494791'
            }
        ]
    };

    return (
        <ReactECharts option={options} />
    );
}