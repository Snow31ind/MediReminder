import React from 'react'
// import 'react-native'

import renderer from 'react-test-renderer'

import {getGenders, getGenderCodeList } from '../src/GenderPicker'


it('GenderPicker gender list is fetched', () => {
  const genders = getGenders();
  expect(genders.ASEXUAL).toBeDefined();
})

it('GenderPicker gender list is fetched', () => {
  const genders = getGenderCodeList();
  expect(genders).toHaveLength(32);
})
