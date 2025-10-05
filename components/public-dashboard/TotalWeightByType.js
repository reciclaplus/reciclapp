import ReactECharts from 'echarts-for-react'
import { usePublicTotalWeightByType } from '../../hooks/queries'

export default function TotalWeightByType() {
  const weightQuery = usePublicTotalWeightByType()
  const weight = weightQuery.status === 'success' ? weightQuery.data : { pet: 0, plasticoduro: 0, galones: 0, basura: 0 }

  const options = {
    textStyle: {
      fontFamily: 'Oswald'
    },
    title: {
      text: 'Peso total por tipo de plástico',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} lb ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'bottom'
    },
    series: [
      {
        name: 'Peso total',
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
        labelLine: {
          show: false
        },
        data: [
          { value: weight.pet, name: 'PET', itemStyle: { color: '#8884d8' } },
          { value: weight.plasticoduro, name: 'Plástico Duro', itemStyle: { color: '#FFC898' } },
          { value: weight.galones, name: 'Galones', itemStyle: { color: '#82ca9d' } },
          { value: weight.basura, name: 'Basura', itemStyle: { color: '#FF5C58' } }
        ]
      }
    ]
  }

  return (
    <ReactECharts option={options} />
  )
}
