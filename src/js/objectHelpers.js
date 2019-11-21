/**
 *
 * @param {Object} object
 * @return {Object}
 */
import {isObject} from '@flexio-oss/assert'

export const deepFreeze = (object) => {
  if (isObject(object)) {
    let propNames = Object.getOwnPropertyNames(object)
    propNames.forEach((name) => {
      let prop = object[name]
      if (isObject(prop) && !Object.isFrozen(prop)) {
        deepFreeze(prop)
      }
    })
  }
  return Object.freeze(object)
}

/**
 *
 * @param {Object} object
 * @returns {Object}
 */
export const deepSeal = (object) => {
  if (isObject(object)) {
    let propNames = Object.getOwnPropertyNames(object)
    propNames.forEach((name) => {
      let prop = object[name]
      if (isObject(prop) && !Object.isSealed(prop)) {
        deepSeal(prop)
      }
    })
  }
  return Object.seal(object)
}

/**
 *
 * @param {Object} object
 * @readonly
 * @return {Object}
 * @function
 * @export
 */
export const deepFreezeSeal = (object) => {
  if (isObject(object)) {

    if ((object instanceof Map || object instanceof Set) && !Object.isSealed(object) && !Object.isFrozen(object)) {
      object.forEach((v) => {
        deepFreezeSeal(v)
      })

      object.set = function(key) {
        throw new Error('Can\'t add property ' + key + ', map/set is not extensible')
      }

      object.add = function(key) {
        throw new Error('Can\'t add property ' + key + ', map/set is not extensible')
      }

      object.delete = function(key) {
        throw new Error('Can\'t delete property ' + key + ', map/set is frozen')
      }

      object.clear = function() {
        throw new Error('Can\'t clear map, map/set is frozen')
      }
    } else {
      let propNames = Object.getOwnPropertyNames(object)
      propNames.forEach((name) => {
        let prop = object[name]
        if (isObject(prop) && !Object.isSealed(prop) && !Object.isFrozen(prop) && Object.getOwnPropertyDescriptor(object, name).writable) {
          deepFreezeSeal(prop)
        }
      })
    }
  }
  return Object.freeze(Object.seal(object))
}

/**
 * split a keys and deep check if key exists in an Object
 * @param {*} object
 * @param {string} keys
 * @param {string} separator
 * @returns {Error|*}
 */
export const deepKeyResolver = (object, keys, separator = '.') => {
  let arrayKeys = keys.split(separator)
  let ret = object
  do {
    let key = arrayKeys.shift()
    if (ret[key] !== undefined && key in ret) {
      ret = ret[key]
    } else {
      throw new Error('No value for this path !')
    }
  } while (arrayKeys.length)
  return ret
}

/**
 *
 * @param {Object} object
 * @param {string} path
 * @param {*} value
 * @param {string} separator
 */
export const deepKeyAssigner = (object, path, value, separator = '.') => {
  let pathParts = path.split(separator)
  let last = path.length

  if (pathParts.length === 1) {
    object[path] = value
  } else {
    if (!object[pathParts[0]]) {
      object[pathParts[0]] = {}
    }
    let start = pathParts[0].length + 1
    let subPath = path.substring(start, last)
    deepKeyAssigner(object[pathParts[0]], subPath, value, separator)
  }
}
