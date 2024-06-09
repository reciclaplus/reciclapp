import ReactECharts from 'echarts-for-react';
import { usePublicWeeklyCollection } from '../../hooks/queries';

export default function WeeklyCollection() {

    const weeklyChartQuery = usePublicWeeklyCollection(104)
    const barData = weeklyChartQuery.status == 'success' ? weeklyChartQuery.data : []

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
            data: barData.map((item) => item["date"]).reverse()
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: barData.map((item) => Object.values(item).filter((item) => item["value"] == 'si').length).reverse(),
                type: 'bar',
                name: 'Número de puntos de recogida',
                color: '#494791'
            }
        ]
    };

    return (
        <ReactECharts option={options} />
    );
}