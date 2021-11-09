import React from 'react'
// import 'react-native'

import renderer from 'react-test-renderer'
import GenderPicker from '../src/GenderPicker';



it('GenderPicker can be created', () => {
  const picker = renderer.create(
    <GenderPicker genderCode={'MALE'} onChange={() => {}} />
  )
  expect(picker).toBeDefined()
})

it('<GenderPicker /> toMatchSnapshot', () => {
  const tree = renderer
    .create(<GenderPicker genderCode={'FEMALE'} onChange={() => {}} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
