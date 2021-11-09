/* eslint-disable no-undef */
// @flow
/* eslint import/newline-after-import: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SafeAreaView from 'react-native-safe-area-view'

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Platform
} from 'react-native'

import Fuse from 'fuse.js'

import genderCodeList from '../data/genderCode.json'
import { getHeightPercent } from './ratio'
import CloseButton from './CloseButton'
import genderPickerStyles from './GenderPicker.style'
import KeyboardAvoidingView from './KeyboardAvoidingView'

let genders = null
let styles = {}

let isEmojiable = false;

const FLAG_TYPES = {
  flat: 'flat'
}

const setGenders = flagType => {
  if (typeof flagType !== 'undefined') {
    isEmojiable = false;
  }

  genders = require('../data/genders.json')
  Emoji = <View />
}

export const getGenders = () => {
  return genders;
}

export const getGenderCodeList = () => {
  return genderCodeList;
}


setGenders()

export const getAllGenders = () =>
  genderCodeList.map(genderCode => ({ ...genders[genderCode], genderCode }))

export default class GenderPicker extends Component {
  static propTypes = {
    genderCode: PropTypes.string.isRequired,
    translation: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    closeable: PropTypes.bool,
    filterable: PropTypes.bool,
    children: PropTypes.node,
    genderList: PropTypes.array,
    excludeGenders: PropTypes.array,
    styles: PropTypes.object,
    filterPlaceholder: PropTypes.string,
    autoFocusFilter: PropTypes.bool,
    // to provide a functionality to disable/enable the onPress of Gender Picker.
    disabled: PropTypes.bool,
    filterPlaceholderTextColor: PropTypes.string,
    closeButtonImage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    transparent: PropTypes.bool,
    animationType: PropTypes.oneOf(['slide', 'fade', 'none']),
    flagType: PropTypes.oneOf(Object.values(FLAG_TYPES)),
    hideAlphabetFilter: PropTypes.bool,
    hideGenderFlag: PropTypes.bool,
    renderFilter: PropTypes.func,
    showCallingCode: PropTypes.bool,
    filterOptions: PropTypes.object,
    showGenderNameWithFlag: PropTypes.bool
  }

  static defaultProps = {
    translation: 'eng',
    genderList: genderCodeList,
    hideGenderFlag: false,
    excludeGenders: [],
    filterPlaceholder: 'Filter',
    autoFocusFilter: true,
    transparent: false,
    animationType: 'none'
  }

  static renderImageFlag(genderCode, imageStyle) {
    return genderCode !== '' ? (
      <Image
        resizeMode={'contain'}
        style={[genderPickerStyles.imgStyle, imageStyle]}
        source={{ uri: genders[genderCode].flag }}
      />
    ) : null
  }

  static renderFlag(genderCode, itemStyle, emojiStyle, imageStyle) {
    return (
      <View style={[genderPickerStyles.itemGenderFlag, itemStyle]}>
        {GenderPicker.renderImageFlag(genderCode, imageStyle)}
      </View>
    )
  }

  static renderFlagWithName(genderCode, countryName, itemStyle, emojiStyle, imageStyle) {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', }}>
        <View style={[genderPickerStyles.itemGenderFlag, itemStyle]}>
          {GenderPicker.renderImageFlag(genderCode, imageStyle)}

        </View>
        <Text style={{ fontSize: 16 }}>{countryName}</Text>
      </View>
    )
  }

  constructor(props) {
    super(props)
    this.openModal = this.openModal.bind(this)

    setGenders(props.flagType)
    let genderList = [...props.genderList]
    const excludeGenders = [...props.excludeGenders]

    excludeGenders.forEach(excludeGender => {
      const index = genderList.indexOf(excludeGender)

      if (index !== -1) {
        genderList.splice(index, 1)
      }
    })

    // Sort gender list
    genderList = genderList
      .map(c => [c, this.getGenderName(genders[c])])
      .sort((a, b) => {
        if (a[1] < b[1]) return -1
        if (a[1] > b[1]) return 1
        return 0
      })
      .map(c => c[0])

    this.state = {
      modalVisible: false,
      genderCodeList: genderList,
      flatListMap: genderList.map(n => ({ key: n })),
      dataSource: genderList,
      filter: '',
      letters: this.getLetters(genderList)
    }

    if (this.props.styles) {
      Object.keys(genderPickerStyles).forEach(key => {
        styles[key] = StyleSheet.flatten([
          genderPickerStyles[key],
          this.props.styles[key]
        ])
      })
      styles = StyleSheet.create(styles)
    } else {
      styles = genderPickerStyles
    }

    const options = Object.assign({
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'genderCode'],
      id: 'id'
    }, this.props.filterOptions);

    const genderFuseList = genderList.reduce(
      (acc, item) => [
        ...acc,
        { id: item, name: this.getGenderName(genders[item]), genderCode: this.getCallingCode(genders[item]) }
      ],
      []
    );

    this.fuse = new Fuse(
      genderList,
      options
    )
  }

  componentDidUpdate(prevProps) {
    if (prevProps.genderList !== this.props.genderList) {
      this.setState({
        genderCodeList: this.props.genderList,
        dataSource: this.props.genderList
      })
    }
  }

  onSelectGender(genderCode) {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: this.state.genderCodeList,
      flatListMap: this.state.genderCodeList.map(n => ({ key: n }))
    })

    this.props.onChange({
      genderCode,
      ...genders[genderCode],
      flag: undefined,
      name: this.getGenderName(genders[genderCode])
    })
  }

  onClose = () => {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: this.state.genderCodeList
    })
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  getGenderName(gender, optionalTranslation) {
    if (!gender) {
      return ''
    }
    const translation = optionalTranslation || this.props.translation || 'eng'
    return gender.name[translation] || gender.name.common
  }

  getCallingCode(gender) {
    return gender.genderCode;
  }

  setVisibleListHeight(offset) {
    this.visibleListHeight = getHeightPercent(100) - offset
  }

  getLetters(list) {
    return Object.keys(
      list.reduce(
        (acc, val) => ({
          ...acc,
          [this.getGenderName(genders[val])
            .slice(0, 1)
            .toUpperCase()]: ''
        }),
        {}
      )
    ).sort()
  }

  openModal = this.openModal.bind(this)

  // dimensions of gender list and window
  itemHeight = getHeightPercent(7)
  listHeight = genders.length * this.itemHeight

  openModal() {
    this.setState({ modalVisible: true })
  }

  scrollTo(letter) {
    // find position of first gender that starts with letter
    const index = this.state.genderCodeList
      .map(gender => this.getGenderName(genders[gender])[0])
      .indexOf(letter)
    if (index === -1) {
      return
    }
    let position = index * this.itemHeight

    // do not scroll past the end of the list
    if (position + this.visibleListHeight > this.listHeight) {
      position = this.listHeight - this.visibleListHeight
    }

    this._flatList.scrollToIndex({ index });
  }

  handleFilterChange = value => {
    const filteredGenders =
      value === '' ? this.state.genderCodeList : this.fuse.search(value)
    this._flatList.scrollToOffset({ offset: 0 });

    this.setState({
      filter: value,
      dataSource: filteredGenders,
      flatListMap: filteredGenders.map(n => ({ key: n }))
    })
  }

  renderGender(genderCode, index) {
    const gender = genders[genderCode];

    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onSelectGender(genderCode)}
        activeOpacity={0.99}
        testID={`gender-selector-${gender.name.common}`}
      >
        {this.renderGenderDetail(genderCode)}
      </TouchableOpacity>
    )
  }

  renderLetters(letter, index) {
    return (
      <TouchableOpacity
        testID={`letter-${letter}`}
        key={index}
        onPress={() => this.scrollTo(letter)}
        activeOpacity={0.6}
      >
        <View style={styles.letter}>
          <Text style={styles.letterText} allowFontScaling={false}>
            {letter}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderGenderDetail(genderCode) {
    const gender = genders[genderCode]
    return (
      <View style={styles.itemGender}>
        {!this.props.hideGenderFlag &&
          GenderPicker.renderFlag(genderCode,
            styles.itemGenderFlag,
            styles.emojiFlag,
            styles.imgStyle)}
        <View style={styles.itemGenderName}>
          <Text style={styles.countryName} allowFontScaling={false}>
            {this.getGenderName(gender)}
            {this.props.showCallingCode &&
              gender.genderCode &&
              ` (+${gender.genderCode})`}
          </Text>
        </View>
      </View>
    )
  }

  renderFilter = () => {
    const {
      renderFilter,
      autoFocusFilter,
      filterPlaceholder,
      filterPlaceholderTextColor
    } = this.props

    const value = this.state.filter
    const onChange = this.handleFilterChange
    const onClose = this.onClose

    return renderFilter ? (
      renderFilter({ value, onChange, onClose })
    ) : (
        <TextInput
          testID="text-input-gender-filter"
          autoFocus={autoFocusFilter}
          autoCorrect={false}
          placeholder={filterPlaceholder}
          placeholderTextColor={filterPlaceholderTextColor}
          style={[styles.input, !this.props.closeable && styles.inputOnly]}
          onChangeText={onChange}
          value={value}
        />
      )
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={() => this.setState({ modalVisible: true })}
          activeOpacity={0.7}
        >
          {this.props.children ? (
            this.props.children
          ) : (
              <View
                style={[styles.touchFlag, { marginTop: isEmojiable ? 0 : 5 }]}
              >
                {this.props.showGenderNameWithFlag && GenderPicker.renderFlagWithName(this.props.genderCode, this.getGenderName(genders[this.props.genderCode]),
                  styles.itemGenderFlag,
                  styles.emojiFlag,
                  styles.imgStyle)}

                {!this.props.showGenderNameWithFlag && GenderPicker.renderFlag(this.props.genderCode,
                  styles.itemGenderFlag,
                  styles.emojiFlag,
                  styles.imgStyle)}
              </View>
            )}
        </TouchableOpacity>
        <Modal
          transparent={this.props.transparent}
          animationType={this.props.animationType}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.header}>
              {this.props.closeable && (
                <CloseButton
                  image={this.props.closeButtonImage}
                  styles={[styles.closeButton, styles.closeButtonImage]}
                  onPress={() => this.onClose()}
                />
              )}
              {this.props.filterable && this.renderFilter()}
            </View>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.contentContainer}>
                <FlatList
                  testID="list-countries"
                  keyboardShouldPersistTaps="handled"
                  data={this.state.flatListMap}
                  ref={flatList => (this._flatList = flatList)}
                  initialNumToRender={30}
                  onScrollToIndexFailed={() => { }}
                  renderItem={gender => this.renderGender(gender.item.key)}
                  keyExtractor={(item) => item.key}
                  getItemLayout={(data, index) => (
                    { length: this.itemHeight, offset: this.itemHeight * index, index }
                  )}
                />
                {!this.props.hideAlphabetFilter && (
                  <ScrollView
                    contentContainerStyle={styles.letters}
                    keyboardShouldPersistTaps="always"
                  >
                    {this.state.filter === '' &&
                      this.state.letters.map((letter, index) =>
                        this.renderLetters(letter, index)
                      )}
                  </ScrollView>
                )}
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}
