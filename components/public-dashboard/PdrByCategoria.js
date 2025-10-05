import ReactECharts from 'echarts-for-react'
import { usePublicPdrByCategoria } from '../../hooks/queries'

export default function PdrByCategoria() {
  const pdrQuery = usePublicPdrByCategoria()
  const pdrData = pdrQuery.status === 'success' ? pdrQuery.data : []

  const categoriaLabels = {
    casa: 'Casa Particular',
    escuela: 'Escuela',
    negocio: 'Negocio',
    iglesia: 'Iglesia'
  }

  const categoriaColors = {
    casa: '#494791',
    escuela: '#4f772d',
    negocio: '#f6ae2d',
    iglesia: '#008198'
  }

  const options = {
    textStyle: {
      fontFamily: 'Oswald'
    },
    title: {
      text: 'Puntos de recogida por categoría',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: pdrData.map((item) => categoriaLabels[item.categoria] || item.categoria),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: pdrData.map((item) => ({
          value: item.count,
          itemStyle: { color: categoriaColors[item.categoria] || '#494791' }
        })),
        type: 'bar',
        name: 'Cantidad',
        barWidth: '60%'
      }
    ]
  }

  return (
    <ReactECharts option={options} />
  )
}
