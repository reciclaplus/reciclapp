import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { API_URL } from '../../configuration';

export default function WeeklyCollection() {

    const [barData, setBarData] = useState([])

    useEffect(() => {
        fetch(`${API_URL}/public/recogida/get/last_n?n=${104}`, {
            method: 'GET',
        }).then((response) => response.json())
            .then(function (myJson) {
                setBarData(myJson)
            })
    }, [])

    const options = {
        legend: { show: true },
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