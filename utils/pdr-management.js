import { getWeekNumber } from './dates'

export function pdrExists(barrio, id, listofpdr) {
  if (listofpdr.filter(pdr => pdr.barrio === barrio && pdr.id === id).length > 0) {
    return true
  } else {
    return false
  }
}

export function getActivePdr(pdr) {
  const a = pdr.filter(activeFilter)

  function activeFilter(e) {
    if (Boolean(e.active) === true) {
      return e
    }
  }
  return a
}

export function calculateAlert(params) {
  const pdr = params.row
  let alerta = pdr.recogida.length > 2

  for (let i = 0; i < 3; i++) {
    const date = new Date()
    date.setDate(date.getDate() - 7 * i)

    const week = getWeekNumber(date)
    const year = date.getFullYear()

    const weekData = pdr.recogida.filter(function (weekRow) {
      return weekRow.year === year && weekRow.week === week
    })

    if (weekData.length > 0 && weekData[0].wasCollected !== 'no' && weekData[0].wasCollected !== 'cerrado') {
      alerta = false
    }
  }
  return alerta
}

export function setNewInternalId(pdr) {
  if (pdr.length < 1) {
    return 1
  }
  const internalIds = pdr.map(individualPdr => individualPdr.internal_id)
  return Math.max(...internalIds) + 1
}
