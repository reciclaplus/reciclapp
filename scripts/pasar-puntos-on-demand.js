import moment from 'moment'
import { getDateOfWeek, getMonday } from '../utils/dates'

export function pasarPuntosToStatsWrapper (pdr, stats, years, weeks, categorias, barrios) {
  years.forEach(year => {
    weeks.forEach(week => {
      categorias.forEach(categoria => {
        barrios.forEach(barrio => {
          pasarPuntosToStats(barrio, categoria, pdr, stats, year, week)
        })
      })
    })
  })
}
export function pasarPuntosToStats (barrio, categoria, pdr, stats, year, week) {
  const date = getDateOfWeek(week, year)
  const previousResult = stats.recogidaSemanal.find(element => element.barrio === barrio &&
        element.date === moment(getMonday(date)).format('DD/MM/YYYY') &&
        element.categoria === categoria)
  if (previousResult) {
    return
  }

  const validPdr = pdr.filter(individualPdr => individualPdr.barrio === barrio && individualPdr.categoria === categoria)
  const puntos = validPdr.map(individualPdr => {
    const recogida = individualPdr.recogida.find(diaDeRecogida => diaDeRecogida.week === week && diaDeRecogida.year === year)
    if (recogida) {
      return recogida.wasCollected === 'si'
    } else {
      return undefined
    }
  })

  const totalPdr = puntos.filter(Boolean).length + puntos.filter(value => value === false).length

  if (totalPdr > 0) {
    stats.recogidaSemanal.push({
      barrio,
      date: moment(getMonday(getDateOfWeek(week, year))).format('DD/MM/YYYY'),
      categoria,
      totalPdr,
      affirmativePdr: puntos.filter(Boolean).length

    })
  }
}
