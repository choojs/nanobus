var assert = require('assert')

module.exports = Nanobus

function Nanobus () {
  if (!(this instanceof Nanobus)) return new Nanobus()
  this._starListeners = []
  this._starOnces = []
  this._listeners = {}
  this._onces = {}
}

Nanobus.prototype.emit = function (eventName, data) {
  assert.equal(typeof eventName, 'string', 'nanobus.emit: eventName should be type string')

  if (this._starListeners.length) this._emit(this._starListeners, data)
  if (this._starOnces.length) {
    this._emit(this._starOnces, data)
    this._starOnces = []
  }

  var listeners = this._listeners[eventName]
  if (listeners && listeners.length) this._emit(listeners, data)

  var onces = this._onces[eventName]
  if (onces && onces.length) {
    this._emit(onces, data)
    this._onces[eventName] = []
  }
}

Nanobus.prototype._emit = function (arr, data) {
  var length = arr.length
  for (var i = 0; i < length; i++) {
    var listener = arr[i]
    listener(data)
  }
}

Nanobus.prototype.on = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.on: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.on: listener should be type function')

  if (eventName === '*') {
    this._starListeners.push(listener)
  } else {
    if (!this._listeners[eventName]) this._listeners[eventName] = []
    this._listeners[eventName].push(listener)
  }
}

Nanobus.prototype.once = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.on: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.on: listener should be type function')

  if (eventName === '*') {
    this._star.push(listener)
  } else {
    if (!this._onces[eventName]) this._onces[eventName] = []
    this._onces[eventName].push(listener)
  }
}

Nanobus.prototype.removeListener = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.on: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.on: listener should be type function')

  if (eventName === '*') {
    if (remove(this._starOnces)) return
    if (remove(this._starListeners)) return
  } else {
    if (remove(this._listeners[eventName])) return
    if (remove(this._onces[eventName])) return
  }

  function remove (arr, listener) {
    if (!arr) return
    var index = arr.indexOf(listener)
    if (index !== -1) {
      arr.splice(index, 1)
      return true
    }
  }
}

Nanobus.prototype.removeAllListeners = function (eventName) {
  if (eventName) {
    if (eventName === '*') {
      this._starListeners = []
      this._starOnces = []
    } else {
      this._listeners[eventName] = []
      this._onces[eventName] = []
    }
  } else {
    this._starListeners = []
    this._starOnces = []
    this._listeners = {}
    this._onces = {}
  }
}
