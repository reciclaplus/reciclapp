import ReactECharts from 'echarts-for-react';


export default function PieChartDemo(props) {
    const pdr = props.pdr
    const options = {
        title: {
            text: 'Distribución de puntos de recogida',
            // subtext: 'Living Expenses in Shenzhen',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'bottom',
        },
        series: [
            {
                name: 'Puntos de recogida',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: false,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                color: ['#133651', '#4f772d', '#f6ae2d', '#008198'],
                labelLine: {
                    show: false
                },
                data: [
                    { value: pdr.filter((punto) => punto.categoria == 'casa').length, name: 'Particulares' },
                    { value: pdr.filter((punto) => punto.categoria == 'negocio').length, name: 'Negocios' },
                    { value: pdr.filter((punto) => punto.categoria == 'escuela').length, name: 'Centros educativos' },
                    { value: pdr.filter((punto) => punto.categoria != 'casa' && punto.categoria != 'negocio' && punto.categoria != 'escuela').length, name: 'Otros' },

                ]
            }
        ]
    };

    return (
        <ReactECharts option={options} />
    );
}

