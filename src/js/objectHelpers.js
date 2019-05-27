/**
 *
 * @param {Object} object
 * @return {ReadonlyArray<any>}
 */
export const deepFreeze = (object) => {
  let propNames = Object.getOwnPropertyNames(object)
  propNames.forEach((name) => {
    let prop = object[name]
    if (typeof prop === 'object' && prop !== null && !Object.isFrozen(prop)) {
      deepFreeze(prop)
    }
  })
  return Object.freeze(object)
}

/**
 *
 * @param {Object} object
 * @returns {Object}
 */
export const deepSeal = (object) => {
  let propNames = Object.getOwnPropertyNames(object)
  propNames.forEach((name) => {
    let prop = object[name]
    if (typeof prop === 'object' && prop !== null && !Object.isSealed(prop)) {
      deepSeal(prop)
    }
  })
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
  let propNames = Object.getOwnPropertyNames(object)
  propNames.forEach((name) => {
    let prop = object[name]
    if (typeof prop === 'object' && prop !== null && !Object.isSealed(prop) && !Object.isFrozen(prop)) {
      deepFreezeSeal(prop)
    }
  })
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