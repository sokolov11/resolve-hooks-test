import _regeneratorRuntime from "@babel/runtime/regenerator";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(rootSaga);

import { fork, takeEvery } from 'redux-saga/effects';
import { LOAD_VIEWMODEL_STATE_REQUEST, LOAD_READMODEL_STATE_REQUEST, SEND_COMMAND_REQUEST, AUTH_REQUEST, LOGOUT } from './action_types';
import loadViewModelStateSaga from './load_view_model_state_saga';
import loadReadModelStateSaga from './load_read_model_state_saga';
import sendCommandSaga from './send_command_saga';
import viewModelSaga from './view_models_saga';
import readModelSaga from './read_models_saga';
import subscribeSaga from './subscribe_saga';
import authSaga from './auth_saga';
import logoutSaga from './logout_saga';

function rootSaga(_ref) {
  var customSagas, sagaArgs, _iterator, _isArray, _i, _ref2, customSaga;

  return _regeneratorRuntime.wrap(function rootSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          customSagas = _ref.customSagas, sagaArgs = _objectWithoutPropertiesLoose(_ref, ["customSagas"]);
          _context.next = 3;
          return fork(subscribeSaga, sagaArgs);

        case 3:
          _context.next = 5;
          return takeEvery(LOAD_VIEWMODEL_STATE_REQUEST, loadViewModelStateSaga, sagaArgs);

        case 5:
          _context.next = 7;
          return takeEvery(LOAD_READMODEL_STATE_REQUEST, loadReadModelStateSaga, sagaArgs);

        case 7:
          _context.next = 9;
          return takeEvery(SEND_COMMAND_REQUEST, sendCommandSaga, sagaArgs);

        case 9:
          _context.next = 11;
          return takeEvery(AUTH_REQUEST, authSaga, sagaArgs);

        case 11:
          _context.next = 13;
          return takeEvery(LOGOUT, logoutSaga, sagaArgs);

        case 13:
          _context.next = 15;
          return fork(viewModelSaga, sagaArgs);

        case 15:
          _context.next = 17;
          return fork(readModelSaga, sagaArgs);

        case 17:
          _iterator = customSagas, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

        case 18:
          if (!_isArray) {
            _context.next = 24;
            break;
          }

          if (!(_i >= _iterator.length)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("break", 33);

        case 21:
          _ref2 = _iterator[_i++];
          _context.next = 28;
          break;

        case 24:
          _i = _iterator.next();

          if (!_i.done) {
            _context.next = 27;
            break;
          }

          return _context.abrupt("break", 33);

        case 27:
          _ref2 = _i.value;

        case 28:
          customSaga = _ref2;
          _context.next = 31;
          return fork(customSaga, sagaArgs);

        case 31:
          _context.next = 18;
          break;

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

export default rootSaga;
//# sourceMappingURL=root_saga.js.map