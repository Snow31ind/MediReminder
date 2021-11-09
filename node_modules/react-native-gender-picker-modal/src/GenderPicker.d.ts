import { StyleProp, ViewStyle, ImageProps } from 'react-native'
import * as React from 'react'

/**
 * Gender metadata stored in this library to display and query
 * `<GenderPicker />`
 */
export interface Gender {
  genderCode: CallingCode
  flag: string
  name: { [key in TranslationLanguageCode]: string }
  genderCode: GenderCode
}

/**
 * Gender code, as specified by the LGBT
 */
export type GenderCode =
  | 'ASEXUAL'
  | 'FEMALE'
  | 'MALE'
  | 'BIGENDER'
  | 'ANDROGYNE'
  | 'AGENDER'
  | 'NEUTROIS'
  | 'INTERGENDER'
  | 'DEMIBOY'
  | 'DEMIGIRL'
  | 'THIRDGENDER'
  | 'AGENDER'
  | 'GENDERQUEER'
  | 'PANGENDER'
  | 'EPICENE'
  | 'ALIAGENDER'
  | 'TRANSGENDER'
  | 'FEMME'
  | 'TRANS_ALT'
  | 'ANDRO_NEUTRAL'
  | 'THIRD_DEMIBOY'
  | 'DEMIAGEN_GIRL'
  | 'DEMIAGEN_BOY'
  | 'BULCH'
  | 'GENDERFLUID'
  | 'INTERGENDER_NEUTROIS'
  | 'THIRD_DEMIGIRL'
  | 'ANDRO_FEMALE'
  | 'DEMIAGENDER_THIRD'
  | 'TRAVESTI'

/**
 * Calling code for a given country. For example, the entry for United States is
 * `1` (referring to "+1`")
 */
export type CallingCode = string

/**
 * Language codes for available translations in this library
 */
export type TranslationLanguageCode =
  | 'eng'


export enum FlagType {
  FLAT = 'flat'
}
export enum AnimationType {
  SLIDE = 'slide',
  FADE = 'fade',
  NONE = 'none'
}

export interface GenderPickerProps {
  /**
   * Gender code, as specified in the LGBT
   */
  genderCode: GenderCode
  /**
   * The handler when a country is selected
   */
  onChange: (value: Gender) => void
  /**
   * Override any style specified in the component (see source code)
   */
  styles?: StyleProp<ViewStyle>
  /**
   * If set to true, Gender Picker List will show calling code after country name. For example: `United States (+1)`
   */
  showCallingCode?: boolean
  /**
   * The handler when the close button is clicked
   */
  onClose?: () => void
  /**
   * List of custom CCA2 genders to render in the list. Use getAllGenders to filter what you need if you want to pass in a custom list
   */
  genderList?: GenderCode[]
  /**
   * The language display for the name of the country
   */
  translation?: TranslationLanguageCode
  /**
   * If true, the GenderPicker will have a close button
   */
  closeable?: boolean
  /**
   * If true, the GenderPicker will have search bar
   */
  filterable?: boolean
  /**
   * List of custom CCA2 genders you don't want to render
   */
  excludeGenders?: GenderCode[]
  /**
   * The search bar placeholder
   */
  filterPlaceholder?: string
  /**
   * Whether or not the search bar should be autofocused
   */
  autoFocusFilter?: boolean
  /**
   * Whether or not the Gender Picker onPress is disabled
   */
  disabled?: boolean
  /**
   * The search bar placeholder text color
   */
  filterPlaceholderTextColor?: string
  /**
   * Custom close button Image
   */
  closeButtonImage?: ImageProps['source']
  /**
   * If true, the GenderPicker will render the modal over a transparent background
   */
  transparent?: boolean
  /**
   * The handler that controls how the modal animates
   */
  animationType?: AnimationType
  /**
   * If set, overwrites the default OS based flag type.
   */
  flagType?: FlagType
  /**
   * If set to true, prevents the alphabet filter rendering
   */
  hideAlphabetFilter?: boolean
  /**
   * If set, then gender name will appear next to flag in the view
   */
  showGenderNameWithFlag?: boolean
  /**
   * If 'filterable={true}' and renderFilter function is provided, render custom filter component.*
   */
  renderFilter?: (args: {
    value: string
    onChange: GenderPickerProps['onChange']
    onClose: GenderPickerProps['onClose']
  }) => React.ReactNode
}

export default class GenderPicker extends React.Component<GenderPickerProps> {
  openModal: () => void
}

export function getAllGenders(): Gender[]

export function getGenders(): Gender[]

export function getGenderCodeList(): string[];

