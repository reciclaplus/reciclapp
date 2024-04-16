import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { API_URL } from '../../configuration';

export default function MonthlyWeight() {

    const [weight, setWeight] = useState([])

    useEffect(() => {
        fetch(`${API_URL}/public/recogida/weight/get`, {
            method: 'GET',
        }).then((response) => response.json())
            .then(function (myJson) {
                setWeight(myJson)
            })
    }, [])

    const options = {
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
                color: '#133651'
            }
        ]
    };

    return (
        <ReactECharts option={options} />
    );
}