/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * This class is responsible for coordinating the "focused"
 * state for TextInputs. All calls relating to the keyboard
 * should be funneled through here
 *
 * @format
 * @flow
 */

'use strict';

const Platform = require('Platform');
const UIManager = require('UIManager');

const inputs = new Set();

let currentlyFocusedID: ?number = null;

const TextInputState = {
  /**
   * Returns the ID of the currently focused text field, if one exists
   * If no text field is focused it returns null
   */
  currentlyFocusedField: function(): ?number {
    return currentlyFocusedID;
  },

  /**
   * @param {number} TextInputID id of the text field to focus
   * Focuses the specified text field
   * noop if the text field was already focused
   */
  focusTextInput: function(textFieldID: ?number) {
    if (currentlyFocusedID !== textFieldID && textFieldID !== null) {
      currentlyFocusedID = textFieldID;
      if (Platform.OS === 'ios') {
        UIManager.focus(textFieldID);
      } else if (Platform.OS === 'android') {
        UIManager.dispatchViewManagerCommand(
          textFieldID,
          UIManager.AndroidTextInput.Commands.focusTextInput,
          null,
        );
      }
    }
  },

  /**
   * @param {number} textFieldID id of the text field to unfocus
   * Unfocuses the specified text field
   * noop if it wasn't focused
   */
  blurTextInput: function(textFieldID: ?number) {
    if (currentlyFocusedID === textFieldID && textFieldID !== null) {
      currentlyFocusedID = null;
      if (Platform.OS === 'ios') {
        UIManager.blur(textFieldID);
      } else if (Platform.OS === 'android') {
        UIManager.dispatchViewManagerCommand(
          textFieldID,
          UIManager.AndroidTextInput.Commands.blurTextInput,
          null,
        );
      }
    }
  },

  registerInput: function(textFieldID: number) {
    inputs.add(textFieldID);
  },

  unregisterInput: function(textFieldID: number) {
    inputs.delete(textFieldID);
  },

  isTextInput: function(textFieldID: number) {
    return inputs.has(textFieldID);
  },
};

module.exports = TextInputState;
