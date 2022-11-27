import Vue from 'vue'
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate'
import {
  required,
  digits,
  email,
  min,
  max,
  regex,
  confirmed,
  max_value,
  min_value
} from 'vee-validate/dist/rules'

// Add a rule.
extend('secret', {
  validate: value => value === 'example',
  message: 'This is not the magic word'
})

extend('digits', {
  ...digits,
  message: '{_field_} needs to be {length} digits. ({_value_})'
})

extend('required', {
  ...required,
  message: '{_field_} is required'
})

extend('min', {
  ...min,
  message: '{_field_} may not be less than {length} characters'
})

extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters'
})

extend('max_value', {
  ...max_value,
  message: 'The {_field_} only left {max} '
})

extend('min_value', {
  ...min_value,
  message: 'The {_field_} field must be {min} or more'
})

extend('regex', {
  ...regex,
  message: '{_field_} {_value_} does not match {regex}'
})

extend('email', {
  ...email,
  message: 'Email must be valid email'
})
const phoneRule = {
  validate (value, args) {
    // Custom regex for a phone number
    // (supplied in the SO post: https://stackoverflow.com/q/50033651/2600825)
    // const MOBILEREG = /^(([0-9])+\d{8})$/
    const MOBILEREG = /^(([0-9])+\d{6})$/
    // const MOBILEREG = /^((\d(\s +)?)+\d{6})$/
    // Check for either of these to return true
    return MOBILEREG.test(value)
  }
}
const onlydigitRule = {
  validate (value, args) {
    // for remove leaeing zero
    // ^ - start of string
    // (?: - start of an alternation group:
    //     [1 - 9][0 - 9] * - a digit from 1 to 9 and then any 0 + digits
    //     | - or
    //     0 - a 0
    // ) - end of the group
    // $ - end of the string.
    const ONLYDIGIT = /^(?:[1-9][0-9]*|0)$/
    return ONLYDIGIT.test(value)
  }
}
const oneNineDigitRule = {
  validate (value, args) {
    // for remove leaeing zero
    // ^ - start of string
    // (?: - start of an alternation group:
    //     [1 - 9][0 - 9] * - a digit from 1 to 9 and then any 0 + digits
    //     | - or
    //     0 - a 0
    // ) - end of the group
    // $ - end of the string.
    const ONLYDIGIT = /^(?:[1-9][0-9]*)$/
    return ONLYDIGIT.test(value)
  }
}
const sixDRoule = {
  validate (value, args) {
    // const NRC = /\d{6}/
    const NRC = /^((\d(\s +)?){6})$/
    return NRC.test(value)
  }
}
const tenDRoule = {
  validate (value, args) {
    // const NRC = /\d{6}/
    const NRC = /^((\d(\s +)?){10})$/
    return NRC.test(value)
  }
}

extend('phone', {
  ...phoneRule,
  message: '{_field_} must be valid phone number'
})
extend('onlydigit', {
  ...onlydigitRule,
  message: '{_field_} must be valid number'
})
extend('oneNineDigit', {
  ...oneNineDigitRule,
  message: '{_field_} must be valid number'
})

extend('six', {
  ...sixDRoule,
  message: '{_field_} must be exactly 6 digit numbers '
})

extend('ten', {
  ...tenDRoule,
  message: '{_field_} must be exactly 10 digit numbers '
})
extend('confirmed', {
  ...confirmed,
  message: '{_field_} must be match with {target} '
})
extend('between', {
  params: ['min', 'max'],
  validate (value, { min, max }) {
    return value >= min && value <= max
  },
  message: '{_field_} must be between {min} and {max}'
})
// Register it globally
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
