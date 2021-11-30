import React from 'react'
import { View, Text } from 'react-native'

export function toTimeString(day) {
  const h = day.getHours()
  const m = day.getMinutes()

  const str = (
    ((h % 12) < 10 ? '0' : '')
    + (h % 12).toString()
    + ':'
    + (m < 10 ?  '0' : '')
    + m.toString()
    + ' '
    + (h <= 12 ? 'AM' : 'PM')
  )

  return str
}
