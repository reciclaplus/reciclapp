import ReactECharts from 'echarts-for-react'
import { usePublicWeightTotals } from '../../hooks/queries'

export default function WeightByType () {
  const weightQuery = usePublicWeightTotals()
  const weight = weightQuery.status === 'success' ? weightQuery.data : { plasticoduro: 0, galones: 0, pet: 0 }

  const options = {
    textStyle: {
      fontFamily: 'Oswald'
    },
    title: {
      text: 'Total de plástico recogido por tipo (lb)',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'bottom'
    },
    series: [
      {
        name: 'Peso (lb)',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c} lb'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        color: ['#494791', '#4f772d', '#f6ae2d'],
        data: [
          { value: weight.plasticoduro || 0, name: 'Plástico Duro' },
          { value: weight.galones || 0, name: 'Galones' },
          { value: weight.pet || 0, name: 'PET' }
        ]
      }
    ]
  }

  return (
    <ReactECharts option={options} />
  )
}
