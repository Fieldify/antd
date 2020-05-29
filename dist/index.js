function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fieldify = require('fieldify');
var React = require('react');
var React__default = _interopDefault(React);
var antd = require('antd');
var icons = require('@ant-design/icons');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var FieldifyTypeForm = /*#__PURE__*/function (_Component) {
  _inheritsLoose(FieldifyTypeForm, _Component);

  function FieldifyTypeForm(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = _this.cycle(props);

    if (props.verify === true) {
      _this.verify(props.value, function (ret) {
        _this.state = _extends({}, _this.state, ret);
      });
    }

    return _this;
  }

  var _proto = FieldifyTypeForm.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(props, state) {
    if (this.props !== props) {
      var cycle = this.cycle(this.props);
      this.setState(cycle);
    }
  };

  _proto.cycle = function cycle(props) {
    this.schema = props.schema;
    var state = {
      value: props.value
    };
    this.isInjected = props.isInjected;
    this.onChange = props.onChange ? props.onChange : function () {};
    this.onError = props.onError ? props.onError : function () {};
    if (!this.schema) return state;
    state.options = this.schema.$options || {};
    this.handler = this.schema.$_type;
    return state;
  };

  _proto.timedChange = function timedChange(cb, speed) {
    var _this2 = this;

    if (this._changeTimer) {
      this._changeTimerQueue++;
      this._changeTimerCb = cb;
      return;
    }

    cb = cb || this._changeTimerCb;
    if (!cb) return;
    delete this._changeTimerCb;
    this._changeTimerQueue = 0;
    this._changeTimer = setTimeout(function () {
      cb(function () {
        delete _this2._changeTimer;

        if (_this2._changeTimerQueue > 0) {
          _this2.timedChange(cb, speed);
        }
      });
    }, speed);
  };

  _proto.changeValue = function changeValue(value, speed) {
    var _this3 = this;

    speed = speed || 500;
    this.setState({
      value: value
    });
    this._lastValue = value;
    this.timedChange(function (end) {
      _this3.verify(_this3._lastValue, function (ret) {
        _this3.setState(ret);

        if (ret.status !== "success") {
          end();
          return;
        }

        _this3.onChange(_this3.schema, _this3._lastValue);

        end();
      });
    }, speed);
  };

  _proto.verify = function verify(value, cb) {
    var _this4 = this;

    this.handler.verify(value, function (error, message) {
      if (error === false) {
        _this4.onError(false);

        return cb({
          status: "success",
          feedback: true,
          help: null
        });
      }

      _this4.onError(true, message);

      return cb({
        status: "error",
        feedback: true,
        help: message
      });
    });
  };

  _proto.render = function render(children) {
    if (!this.schema || this.isInjected === true) return /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: this.schema.$doc,
      required: this.schema.$required,
      validateStatus: this.state.status,
      hasFeedback: this.state.feedback,
      help: this.state.help,
      style: {
        marginBottom: "0px"
      },
      wrapperCol: {
        sm: 24
      }
    }, children);
    return /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: this.schema.$doc,
      required: this.schema.$required,
      validateStatus: this.state.status,
      hasFeedback: this.state.feedback,
      help: this.state.help,
      style: {
        marginBottom: "8px"
      },
      wrapperCol: {
        sm: 24
      }
    }, children);
  };

  return FieldifyTypeForm;
}(React.Component);

var SignderivaTypeInfo = /*#__PURE__*/function (_Component) {
  _inheritsLoose(SignderivaTypeInfo, _Component);

  function SignderivaTypeInfo(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.props = props;
    if (props.match) _this.path = props.match.path;
    _this.state = {};
    return _this;
  }

  var _proto = SignderivaTypeInfo.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
  };

  return SignderivaTypeInfo;
}(React.Component);

var SignderivaTypeBuilder = /*#__PURE__*/function (_Component) {
  _inheritsLoose(SignderivaTypeBuilder, _Component);

  function SignderivaTypeBuilder(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.props = props;
    _this.onChange = props.onChange ? props.onChange : function () {};
    if (props.match) _this.path = props.match.path;
    _this.state = _extends({}, props.options);
    _this["default"] = {};
    return _this;
  }

  var _proto = SignderivaTypeBuilder.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    var pNew = this.props.options || {};
    var pOld = prevProps.options || {};
    var changed = 0;

    for (var key in this["default"]) {
      var o = pOld[key];
      var n = pNew[key];
      if (o !== n) changed++;
    }

    if (changed > 0) {
      this.setState(pNew);
      this.onChange(_extends({}, pNew));
    }
  };

  _proto.setup = function setup(prev) {
    var state = _extends({}, prev);

    for (var a in state) {
      var p = this["default"][a];
      if (!p) delete state[a];
    }

    for (var a in this["default"]) {
      if (!(a in state)) state[a] = this["default"][a];
    }

    return state;
  };

  _proto.configure = function configure() {
    this.state = this.setup(this.state);
    this.onChange(_extends({}, this.state));
  };

  _proto.changeIt = function changeIt(key, value) {
    var change = Object.assign({}, this.state);
    change[key] = value;
    this.setState(change);
    this.onChange(_extends({}, change));
  };

  return SignderivaTypeBuilder;
}(React.Component);

var StringForm = /*#__PURE__*/function (_TypeForm) {
  _inheritsLoose(StringForm, _TypeForm);

  function StringForm() {
    return _TypeForm.apply(this, arguments) || this;
  }

  var _proto = StringForm.prototype;

  _proto.render = function render() {
    var _this = this;

    return _TypeForm.prototype.render.call(this, /*#__PURE__*/React__default.createElement(antd.Input, {
      value: this.state.value,
      placeholder: this.state.options.placeholder,
      onChange: function onChange(_ref) {
        var target = _ref.target;
        return _this.changeValue(target.value);
      },
      style: {
        width: "100%"
      }
    }));
  };

  return StringForm;
}(FieldifyTypeForm);

var StringInfo = /*#__PURE__*/function (_TypeInfo) {
  _inheritsLoose(StringInfo, _TypeInfo);

  function StringInfo() {
    return _TypeInfo.apply(this, arguments) || this;
  }

  var _proto2 = StringInfo.prototype;

  _proto2.render = function render() {
    return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(antd.Tag, {
      color: "#fadb14",
      style: {
        color: "#555555"
      }
    }, /*#__PURE__*/React__default.createElement(icons.FieldStringOutlined, null)));
  };

  return StringInfo;
}(SignderivaTypeInfo);

var StringBuilder = /*#__PURE__*/function (_TypeBuilder) {
  _inheritsLoose(StringBuilder, _TypeBuilder);

  function StringBuilder(props) {
    var _this2;

    _this2 = _TypeBuilder.call(this, props) || this;
    _this2["default"] = {
      minSize: 1,
      maxSize: 128
    };

    _this2.configure();

    return _this2;
  }

  var _proto3 = StringBuilder.prototype;

  _proto3.render = function render() {
    var _this3 = this;

    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: "String min/max size"
    }, /*#__PURE__*/React__default.createElement(antd.Space, null, /*#__PURE__*/React__default.createElement(antd.InputNumber, {
      min: 0,
      value: this.state.minSize,
      onChange: function onChange(value) {
        return _this3.changeIt("minSize", value);
      }
    }), /*#__PURE__*/React__default.createElement(antd.InputNumber, {
      min: 0,
      value: this.state.maxSize,
      onChange: function onChange(value) {
        return _this3.changeIt("maxSize", value);
      }
    }))));
  };

  return StringBuilder;
}(SignderivaTypeBuilder);

var String = {
  code: fieldify.types.String.code,
  description: fieldify.types.String.description,
  "class": fieldify.types.String["class"],
  Info: StringInfo,
  Builder: StringBuilder,
  Form: StringForm
};

var StringForm$1 = String.Form;

var NameForm = /*#__PURE__*/function (_TypeForm) {
  _inheritsLoose(NameForm, _TypeForm);

  function NameForm(props) {
    return _TypeForm.call(this, props) || this;
  }

  var _proto = NameForm.prototype;

  _proto.cycle = function cycle(props) {
    var ret = _TypeForm.prototype.cycle.call(this, props);

    if (!ret.value) ret.value = {};
    this.result = _extends({}, ret.value);
    return ret;
  };

  _proto.error = function error(from, _error, message) {};

  _proto.setField = function setField(key, schema, value) {
    this.result[key] = value;
    this.onChange(this.schema, this.result);
  };

  _proto.render = function render() {
    var _this = this;

    return _TypeForm.prototype.render.call(this, /*#__PURE__*/React__default.createElement(antd.Row, {
      gutter: 16
    }, /*#__PURE__*/React__default.createElement(antd.Col, {
      className: "gutter-row",
      span: 12
    }, /*#__PURE__*/React__default.createElement(StringForm$1, {
      schema: this.schema.first,
      verify: this.state.verify,
      value: this.state.value.first,
      onChange: function onChange(schema, value) {
        return _this.setField("first", schema, value);
      },
      isInjected: true
    })), /*#__PURE__*/React__default.createElement(antd.Col, {
      className: "gutter-row",
      span: 12
    }, /*#__PURE__*/React__default.createElement(StringForm$1, {
      schema: this.schema.last,
      verify: this.state.verify,
      value: this.state.value.last,
      onChange: function onChange(schema, value) {
        return _this.setField("last", schema, value);
      },
      isInjected: true
    }))));
  };

  return NameForm;
}(FieldifyTypeForm);

var NameInfo = /*#__PURE__*/function (_TypeInfo) {
  _inheritsLoose(NameInfo, _TypeInfo);

  function NameInfo() {
    return _TypeInfo.apply(this, arguments) || this;
  }

  var _proto2 = NameInfo.prototype;

  _proto2.render = function render() {
    return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(antd.Tag, {
      color: "#36cfc9",
      style: {
        color: "#555555"
      }
    }, /*#__PURE__*/React__default.createElement(icons.UserSwitchOutlined, null)));
  };

  return NameInfo;
}(SignderivaTypeInfo);

var NameBuilder = /*#__PURE__*/function (_TypeBuilder) {
  _inheritsLoose(NameBuilder, _TypeBuilder);

  function NameBuilder(props) {
    var _this2;

    _this2 = _TypeBuilder.call(this, props) || this;
    _this2["default"] = {
      minSize: 1,
      maxSize: 128
    };

    _this2.configure();

    return _this2;
  }

  var _proto3 = NameBuilder.prototype;

  _proto3.render = function render() {
    var _this3 = this;

    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: "Name min/max size"
    }, /*#__PURE__*/React__default.createElement(antd.Space, null, /*#__PURE__*/React__default.createElement(antd.InputNumber, {
      min: 0,
      value: this.state.minSize,
      onChange: function onChange(value) {
        return _this3.changeIt("minSize", value);
      }
    }), /*#__PURE__*/React__default.createElement(antd.InputNumber, {
      min: 0,
      value: this.state.maxSize,
      onChange: function onChange(value) {
        return _this3.changeIt("maxSize", value);
      }
    }))));
  };

  return NameBuilder;
}(SignderivaTypeBuilder);

var Name = {
  code: fieldify.types.Name.code,
  description: fieldify.types.Name.description,
  "class": fieldify.types.Name["class"],
  Info: NameInfo,
  Builder: NameBuilder,
  Form: NameForm,
  noFormItem: true
};

var EmailForm = /*#__PURE__*/function (_TypeForm) {
  _inheritsLoose(EmailForm, _TypeForm);

  function EmailForm() {
    return _TypeForm.apply(this, arguments) || this;
  }

  var _proto = EmailForm.prototype;

  _proto.render = function render() {
    var _this = this;

    return _TypeForm.prototype.render.call(this, /*#__PURE__*/React__default.createElement(antd.Input, {
      value: this.state.value,
      placeholder: this.state.options.placeholder,
      onChange: function onChange(_ref) {
        var target = _ref.target;
        return _this.changeValue(target.value);
      }
    }));
  };

  return EmailForm;
}(FieldifyTypeForm);

var EmailInfo = /*#__PURE__*/function (_TypeInfo) {
  _inheritsLoose(EmailInfo, _TypeInfo);

  function EmailInfo() {
    return _TypeInfo.apply(this, arguments) || this;
  }

  var _proto2 = EmailInfo.prototype;

  _proto2.render = function render() {
    return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(antd.Tag, {
      color: "#1890ff"
    }, /*#__PURE__*/React__default.createElement(icons.MailOutlined, null)));
  };

  return EmailInfo;
}(SignderivaTypeInfo);

var EmailBuilder = /*#__PURE__*/function (_TypeBuilder) {
  _inheritsLoose(EmailBuilder, _TypeBuilder);

  function EmailBuilder(props) {
    var _this2;

    _this2 = _TypeBuilder.call(this, props) || this;
    _this2["default"] = {
      subAddressing: true
    };

    _this2.configure();

    return _this2;
  }

  var _proto3 = EmailBuilder.prototype;

  _proto3.render = function render() {
    var _this3 = this;

    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: "Sub-addressing"
    }, /*#__PURE__*/React__default.createElement(antd.Checkbox, {
      checked: this.state.subAddressing,
      onChange: function onChange(_ref2) {
        var target = _ref2.target;
        return _this3.changeIt("subAddressing", target.checked);
      }
    }, "Allowed")));
  };

  return EmailBuilder;
}(SignderivaTypeBuilder);

var Email = {
  code: fieldify.types.Email.code,
  description: fieldify.types.Email.description,
  "class": fieldify.types.Email["class"],
  Info: EmailInfo,
  Builder: EmailBuilder,
  Form: EmailForm
};

var CheckboxForm = /*#__PURE__*/function (_TypeForm) {
  _inheritsLoose(CheckboxForm, _TypeForm);

  function CheckboxForm() {
    return _TypeForm.apply(this, arguments) || this;
  }

  var _proto = CheckboxForm.prototype;

  _proto.render = function render() {
    return _TypeForm.prototype.render.call(this, /*#__PURE__*/React__default.createElement(antd.Input, {
      placeholder: "Checkbox of characters"
    }));
  };

  return CheckboxForm;
}(FieldifyTypeForm);

var CheckboxInfo = /*#__PURE__*/function (_TypeInfo) {
  _inheritsLoose(CheckboxInfo, _TypeInfo);

  function CheckboxInfo() {
    return _TypeInfo.apply(this, arguments) || this;
  }

  var _proto2 = CheckboxInfo.prototype;

  _proto2.render = function render() {
    return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(antd.Tag, {
      color: "#fadb14",
      style: {
        color: "#555555"
      }
    }, /*#__PURE__*/React__default.createElement(icons.FieldStringOutlined, null)));
  };

  return CheckboxInfo;
}(SignderivaTypeInfo);

var CheckboxBuilder = /*#__PURE__*/function (_TypeBuilder) {
  _inheritsLoose(CheckboxBuilder, _TypeBuilder);

  function CheckboxBuilder(props) {
    var _this;

    _this = _TypeBuilder.call(this, props) || this;
    _this["default"] = {
      minSize: 1,
      maxSize: 128
    };

    _this.configure();

    return _this;
  }

  var _proto3 = CheckboxBuilder.prototype;

  _proto3.render = function render() {
    var _this2 = this;

    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: "Checkbox min/max size"
    }, /*#__PURE__*/React__default.createElement(antd.Space, null, /*#__PURE__*/React__default.createElement(antd.InputNumber, {
      min: 0,
      value: this.state.minSize,
      onChange: function onChange(value) {
        return _this2.changeIt("minSize", value);
      }
    }), /*#__PURE__*/React__default.createElement(antd.InputNumber, {
      min: 0,
      value: this.state.maxSize,
      onChange: function onChange(value) {
        return _this2.changeIt("maxSize", value);
      }
    }))));
  };

  return CheckboxBuilder;
}(SignderivaTypeBuilder);

var Checkbox = {
  code: fieldify.types.Checkbox.code,
  description: fieldify.types.Checkbox.description,
  "class": fieldify.types.Checkbox["class"],
  Info: CheckboxInfo,
  Builder: CheckboxBuilder,
  Form: CheckboxForm
};

var SelectForm = /*#__PURE__*/function (_TypeForm) {
  _inheritsLoose(SelectForm, _TypeForm);

  function SelectForm(props) {
    var _this;

    _this = _TypeForm.call(this, props) || this;
    _this.state = {
      value: props.value,
      options: {}
    };
    if (props.schema.$options) _this.state.options = props.schema.$options;
    _this.state.items = _this.updateItems();
    return _this;
  }

  var _proto = SelectForm.prototype;

  _proto.updateItems = function updateItems() {
    if (!this.state.options.items) return [];
    var options = [];

    for (var key in this.state.options.items) {
      var value = this.state.options.items[key];
      options.push( /*#__PURE__*/React__default.createElement(antd.Select.Option, {
        value: key,
        key: key
      }, value));
    }

    return options;
  };

  _proto.render = function render() {
    var _this2 = this;

    return _TypeForm.prototype.render.call(this, /*#__PURE__*/React__default.createElement(antd.Select, {
      value: this.state.value,
      onChange: function onChange(value) {
        return _this2.changeValue(value);
      }
    }, this.state.items));
  };

  return SelectForm;
}(FieldifyTypeForm);

var SelectInfo = /*#__PURE__*/function (_TypeInfo) {
  _inheritsLoose(SelectInfo, _TypeInfo);

  function SelectInfo() {
    return _TypeInfo.apply(this, arguments) || this;
  }

  var _proto2 = SelectInfo.prototype;

  _proto2.render = function render() {
    return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(antd.Tag, {
      color: "#fadb14",
      style: {
        color: "#555555"
      }
    }, /*#__PURE__*/React__default.createElement(icons.FieldStringOutlined, null)));
  };

  return SelectInfo;
}(SignderivaTypeInfo);

var SelectBuilder = /*#__PURE__*/function (_TypeBuilder) {
  _inheritsLoose(SelectBuilder, _TypeBuilder);

  function SelectBuilder(props) {
    var _this3;

    _this3 = _TypeBuilder.call(this, props) || this;
    _this3["default"] = {
      minSize: 1,
      maxSize: 128
    };

    _this3.configure();

    return _this3;
  }

  var _proto3 = SelectBuilder.prototype;

  _proto3.render = function render() {
    var _this4 = this;

    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: "Select min/max size"
    }, /*#__PURE__*/React__default.createElement(antd.Space, null, /*#__PURE__*/React__default.createElement(antd.InputNumber, {
      min: 0,
      value: this.state.minSize,
      onChange: function onChange(value) {
        return _this4.changeIt("minSize", value);
      }
    }), /*#__PURE__*/React__default.createElement(antd.InputNumber, {
      min: 0,
      value: this.state.maxSize,
      onChange: function onChange(value) {
        return _this4.changeIt("maxSize", value);
      }
    }))));
  };

  return SelectBuilder;
}(SignderivaTypeBuilder);

var Select = {
  code: fieldify.types.Select.code,
  description: fieldify.types.Select.description,
  "class": fieldify.types.Select["class"],
  Info: SelectInfo,
  Builder: SelectBuilder,
  Form: SelectForm
};

var FieldNameForm = /*#__PURE__*/function (_String$Form) {
  _inheritsLoose(FieldNameForm, _String$Form);

  function FieldNameForm(props) {
    return _String$Form.call(this, props) || this;
  }

  var _proto = FieldNameForm.prototype;

  _proto.verify = function verify(input, cb) {
    var _this = this;

    _String$Form.prototype.verify.call(this, input, function (ret) {
      if (ret.status !== "success") {
        return cb(ret);
      }

      if (_this.props.user && input in _this.props.user) {
        var msg = "Field name already used";

        _this.onError(true, msg);

        return cb({
          status: "error",
          feedback: true,
          help: msg
        });
      }

      cb(ret);
    });
  };

  return FieldNameForm;
}(String.Form);

var FieldNameInfo = /*#__PURE__*/function (_String$Info) {
  _inheritsLoose(FieldNameInfo, _String$Info);

  function FieldNameInfo() {
    return _String$Info.apply(this, arguments) || this;
  }

  return FieldNameInfo;
}(String.Info);

var FieldNameBuilder = /*#__PURE__*/function (_TypeBuilder) {
  _inheritsLoose(FieldNameBuilder, _TypeBuilder);

  function FieldNameBuilder(props) {
    var _this2;

    _this2 = _TypeBuilder.call(this, props) || this;
    _this2["default"] = {
      minSize: 1,
      maxSize: 128
    };
    return _this2;
  }

  var _proto2 = FieldNameBuilder.prototype;

  _proto2.render = function render() {
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: "FieldName min/max size"
    }));
  };

  return FieldNameBuilder;
}(SignderivaTypeBuilder);

var FieldName = {
  code: fieldify.types.FieldName.code,
  description: fieldify.types.FieldName.description,
  "class": fieldify.types.FieldName["class"],
  Info: FieldNameInfo,
  Builder: FieldNameBuilder,
  Form: FieldNameForm
};

var types = {
  Name: Name,
  Email: Email,
  String: String,
  Select: Select,
  Checkbox: Checkbox,
  FieldName: FieldName
};

var FieldifySchema = /*#__PURE__*/function (_schema) {
  _inheritsLoose(FieldifySchema, _schema);

  function FieldifySchema(name, options) {
    return _schema.call(this, name, options) || this;
  }

  var _proto = FieldifySchema.prototype;

  _proto.compile = function compile(schema) {
    _schema.prototype.compile.call(this, schema);
  };

  return FieldifySchema;
}(fieldify.schema);

var FieldifySchemaForm = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(FieldifySchemaForm, _React$Component);

  function FieldifySchemaForm(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = _this.cycle(props, true);
    return _this;
  }

  var _proto = FieldifySchemaForm.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(props, state) {
    if (this.props !== props) {
      var cycle = this.cycle(this.props);
      this.setState(cycle);
    }
  };

  _proto.cycle = function cycle(props, first) {
    this.schema = props.schema;
    this.input = props.input;

    if (!this.input || !(typeof props.input === "object")) {
      this.input = new fieldify.input(this.schema);
    }

    var state = {
      input: this.input.getValue()
    };
    state.reactive = this.update(state.input, state.verify);
    this.references = {};
    this.onChange = props.onChange ? props.onChange : function () {};
    return state;
  };

  _proto.clickAddArray = function clickAddArray(line) {
    this.input.set(line);

    var _value = this.input.getValue();

    this.onChange(_value);
    this.setState({
      input: _value,
      reactive: this.update(_value, false)
    });
  };

  _proto.clickRemoveArrayItem = function clickRemoveArrayItem(line) {
    this.input.remove(line);

    var _value = this.input.getValue();

    this.onChange(_value);
    this.setState({
      input: _value,
      reactive: this.update(_value, false)
    });
  };

  _proto.setValue = function setValue(line, value) {
    this.input.set(line, value);

    var _value = this.input.getValue();

    this.onChange(_value);
    this.setState({
      input: _value
    });
  };

  _proto.input = function input(_input, verify) {};

  _proto.update = function update(input, verify) {
    var _this2 = this;

    var follower = function follower(schema, input, ret, line) {
      line = line || "";
      fieldify.utils.orderedRead(schema, function (index, item) {
        var inputPtr = input ? input[item.$_key] : null;
        var lineKey = line + "." + item.$_key;
        if (item.hidden === true) return;

        if (Array.isArray(item)) {
          var source = _extends({}, item[0]);

          var inputPtr2 = inputPtr;
          var options = source.$array || {};
          var min = options.min ? options.min : source.$required === true ? 1 : 0;
          var columns = [{
            dataIndex: 'form',
            key: 'form',
            width: "100%"
          }, {
            dataIndex: 'actions',
            key: 'actions',
            align: "right"
          }];
          var dataSource = [];

          if (source.$_array === true && source.$_nested !== true) {
            delete source.$doc;
            var TypeForm = source.$type.Form;

            if (!Array.isArray(inputPtr)) {
              input[item.$_key] = [];
              inputPtr2 = input[item.$_key];
            }

            if (!inputPtr2) return ret;

            if (min - inputPtr2.length > 0) {
              for (var a = 0; a <= min - inputPtr2.length; a++) {
                inputPtr2.push(null);
              }
            }

            var _loop = function _loop() {
              var value = inputPtr2[a];
              var key = lineKey + "." + a;
              dataSource.push({
                key: key,
                form: /*#__PURE__*/React__default.createElement(TypeForm, {
                  schema: source,
                  value: value,
                  user: _this2.props.user,
                  onChange: function onChange(schema, value) {
                    return _this2.setValue(key, value);
                  },
                  isInjected: true,
                  onError: function onError(error, message) {
                    if (error === true) {
                      _this2.references[key] = message;
                    } else {
                      var ref = _this2.references[key];

                      if (ref) {
                        delete _this2.references[key];
                      }
                    }
                  }
                }),
                actions: /*#__PURE__*/React__default.createElement(antd.Button, {
                  size: "small",
                  onClick: function onClick() {
                    return _this2.clickRemoveArrayItem(key);
                  }
                }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.DeleteOutlined, null)))
              });
            };

            for (var a = 0; a < inputPtr2.length; a++) {
              _loop();
            }
          } else if (source.$_array === true && source.$_nested === true) {
              var inputPtr2 = input[item.$_key];
              if (!Array.isArray(inputPtr)) inputPtr2 = input[item.$_key] = [];

              if (min - inputPtr2.length > 0) {
                for (var a = 0; a <= min - inputPtr2.length; a++) {
                  inputPtr2.push({});
                }
              }

              if (item[0].$_schematized === true) {
                delete source.$doc;
                var _TypeForm = source.$type.Form;

                var _loop2 = function _loop2() {
                  var value = inputPtr2[a];
                  var key = lineKey + "." + a;
                  dataSource.push({
                    key: key,
                    form: /*#__PURE__*/React__default.createElement(_TypeForm, {
                      schema: source,
                      value: value,
                      user: _this2.props.user,
                      onChange: function onChange(schema, value) {
                        return _this2.setValue(key, value);
                      },
                      isInjected: true,
                      onError: function onError(error, message) {
                        if (error === true) {
                          _this2.references[key] = message;
                        } else {
                          var ref = _this2.references[key];

                          if (ref) {
                            delete _this2.references[key];
                          }
                        }
                      }
                    }),
                    actions: /*#__PURE__*/React__default.createElement(antd.Button, {
                      size: "small",
                      onClick: function onClick() {
                        return _this2.clickRemoveArrayItem(key);
                      }
                    }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.DeleteOutlined, null)))
                  });
                };

                for (var a = 0; a < inputPtr2.length; a++) {
                  _loop2();
                }
              } else {
                var _loop3 = function _loop3() {
                  var value = inputPtr2[a];
                  var key = lineKey + "." + a;
                  var child = [];
                  follower(item.$_ptr[0], value, child, key);
                  dataSource.push({
                    key: key,
                    form: child,
                    actions: /*#__PURE__*/React__default.createElement(antd.Button, {
                      size: "small",
                      onClick: function onClick() {
                        return _this2.clickRemoveArrayItem(key);
                      }
                    }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.DeleteOutlined, null)))
                  });
                };

                for (var a = 0; a < inputPtr2.length; a++) {
                  _loop3();
                }
              }
            }

          ret.push( /*#__PURE__*/React__default.createElement(antd.Form.Item, {
            key: item.$_wire,
            noStyle: true
          }, /*#__PURE__*/React__default.createElement("div", {
            className: "ant-form-item"
          }, /*#__PURE__*/React__default.createElement(antd.Card, {
            size: "small",
            title: source.$_access.$doc,
            extra: /*#__PURE__*/React__default.createElement("div", {
              className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
            }, /*#__PURE__*/React__default.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: function onClick() {
                return _this2.clickAddArray(lineKey + "." + inputPtr2.length);
              }
            }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.PlusOutlined, null))))
          }, /*#__PURE__*/React__default.createElement(antd.Table, {
            size: "small",
            dataSource: dataSource,
            columns: columns,
            verticalAlign: "middle",
            showHeader: false,
            pagination: {
              total: dataSource.length,
              pageSize: dataSource.length,
              hideOnSinglePage: true
            },
            bordered: true
          })))));
        } else if (typeof item === "object" && !item.$type) {
            var child = [];
            follower(item.$_ptr, inputPtr, child, lineKey);
            ret.push( /*#__PURE__*/React__default.createElement("div", {
              key: item.$_wire,
              className: "ant-form-item"
            }, /*#__PURE__*/React__default.createElement(antd.Card, {
              size: "small",
              title: item.$doc
            }, child)));
          } else {
              var _TypeForm2 = item.$type.Form;
              ret.push( /*#__PURE__*/React__default.createElement(_TypeForm2, {
                schema: item,
                value: inputPtr,
                key: item.$_wire,
                user: _this2.props.user,
                onChange: function onChange(schema, value) {
                  return _this2.setValue(lineKey, value);
                },
                onError: function onError(error, message) {
                  if (error === true) {
                    _this2.references[item.$_key] = message;
                  } else {
                    var ref = _this2.references[item.$_key];

                    if (ref) {
                      delete _this2.references[item.$_key];
                    }
                  }
                }
              }));
            }
      });
      return ret;
    };

    var ret = [];
    follower(this.schema.handler.schema, input, ret);
    return ret;
  };

  _proto.render = function render() {
    var layout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    };
    return /*#__PURE__*/React__default.createElement(antd.Form, _extends({}, layout, {
      name: "basic"
    }), this.state.reactive);
  };

  return FieldifySchemaForm;
}(React__default.Component);

var FieldifySchemaBuilderModal = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(FieldifySchemaBuilderModal, _React$Component);

  function FieldifySchemaBuilderModal(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      visible: props.visible,
      user: props.user,
      size: 1
    };
    _this.allTypes = {};

    for (var a in types) {
      _this.allTypes[a] = types[a].description;
    }

    _this.schema = new FieldifySchema("modal");

    _this.schema.compile({
      key: {
        $doc: "Name of the field",
        $type: types.FieldName,
        $required: true
      },
      type: {
        $doc: "Field type",
        $type: types.Select,
        $required: true,
        $options: {
          items: _this.allTypes
        }
      },
      doc: {
        $doc: "Description",
        $required: true,
        $type: types.String
      }
    });

    _this.formRef = React__default.createRef();
    return _this;
  }

  var _proto = FieldifySchemaBuilderModal.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(props, state) {
    var newState = _extends({}, this.state);

    var changed = false;

    if (this.state.visible !== this.props.visible) {
      newState.visible = this.props.visible;
      changed = true;
    }

    if (this.state.user !== this.props.user) {
      newState.user = this.props.user;
      changed = true;
    }

    if (changed === true) this.setState(newState);
  };

  _proto.receiveHeadForm = function receiveHeadForm() {
    console.log("receiveHeadForm");
  };

  _proto.render = function render() {
    var _this2 = this;

    var onOk = function onOk() {};

    var onCancel = function onCancel() {
      _this2.props.onCancel(_this2.state);
    };
    return /*#__PURE__*/React__default.createElement(antd.Modal, {
      title: "Add New Field To Your Schema",
      width: this.state.size * 520,
      centered: true,
      visible: this.state.visible,
      onOk: onOk,
      onCancel: onCancel
    }, /*#__PURE__*/React__default.createElement(FieldifySchemaForm, {
      ref: this.formRef,
      schema: this.schema,
      user: this.props.user,
      onChange: this.receiveHeadForm.bind(this)
    }));
  };

  return FieldifySchemaBuilderModal;
}(React__default.Component);

var FieldifySchemaBuilder = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(FieldifySchemaBuilder, _React$Component);

  function FieldifySchemaBuilder(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      modal: false,
      modalUser: null,
      schemaDataSource: []
    };
    _this.schema = props.schema;
    _this.state.schemaDataSource = _this.updateDataSource();
    _this.columns = [{
      title: 'Key',
      dataIndex: 'name',
      key: 'key'
    }, {
      title: 'Description',
      dataIndex: 'doc',
      key: 'doc'
    }, {
      title: /*#__PURE__*/React__default.createElement("div", {
        className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
      }, /*#__PURE__*/React__default.createElement("span", {
        className: "ant-radio-button-wrapper",
        onClick: function onClick() {
          return _this.handlingAdd();
        }
      }, /*#__PURE__*/React__default.createElement("span", null, "Add Field ", /*#__PURE__*/React__default.createElement(icons.PlusOutlined, null)))),
      dataIndex: 'actions',
      key: 'actions',
      align: "right"
    }];
    return _this;
  }

  var _proto = FieldifySchemaBuilder.prototype;

  _proto.fireOnChange = function fireOnChange() {};

  _proto.itemChanged = function itemChanged(arg) {
    console.log("itemChanged", arg);
  };

  _proto.itemRemove = function itemRemove(item) {
    this.props.schema.removeLineup(item.$_path);
    this.fireOnChange();
    this.setState({
      schemaDataSource: this.updateDataSource()
    });
    antd.notification.success({
      message: "Field removed",
      description: "Field at " + item.$_path + " has been removed successfully"
    });
  };

  _proto.handlingAdd = function handlingAdd(path) {
    path = path || ".";
    var lineup = this.props.schema.getLineup(path) || this.schema.handler.schema;
    console.log("handing add", path, lineup);
    this.setState({
      modal: true,
      modalUser: lineup
    });
  };

  _proto.handlingEdit = function handlingEdit(item) {
    console.log("handing edit", item, Array.isArray(item));
    this.setState({
      modal: true,
      modalContent: item
    });
  };

  _proto.updateDataSource = function updateDataSource() {
    var self = this;

    function fieldify2antDataTable(schema, wire) {
      if (!wire) wire = "";
      var current = [];
      fieldify.utils.orderedRead(schema, function (index, item) {
        var path = wire + "." + item.$_key;
        item.$_path = path;

        if (Array.isArray(item)) {
          var composite = /*#__PURE__*/React__default.createElement(antd.Tooltip, {
            title: "... of objects"
          }, /*#__PURE__*/React__default.createElement(antd.Tag, {
            color: "#722ed1"
          }, /*#__PURE__*/React__default.createElement(icons.UnorderedListOutlined, null)));

          if ("$type" in item[0]) {
            var TypeInfo = item[0].$type.Info;
            composite = /*#__PURE__*/React__default.createElement(TypeInfo, null);
          }

          current.push({
            ptr: item,
            key: path,
            name: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Tooltip, {
              title: "This field is an array ..."
            }, /*#__PURE__*/React__default.createElement(antd.Tag, {
              color: "#eb2f96"
            }, /*#__PURE__*/React__default.createElement(icons.CopyOutlined, null))), composite, /*#__PURE__*/React__default.createElement("strong", null, item.$_key)),
            doc: item.$doc,
            children: !("$type" in item[0]) ? fieldify2antDataTable(item[0], path) : null,
            actions: /*#__PURE__*/React__default.createElement("div", {
              className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
            }, /*#__PURE__*/React__default.createElement(antd.Popconfirm, {
              title: /*#__PURE__*/React__default.createElement("span", null, "Are you sure to delete the Array ", /*#__PURE__*/React__default.createElement("strong", null, path)),
              onConfirm: function onConfirm() {
                return self.itemRemove(item);
              },
              okText: "Yes",
              cancelText: "No"
            }, /*#__PURE__*/React__default.createElement("span", {
              className: "ant-radio-button-wrapper"
            }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.DeleteOutlined, null)))), /*#__PURE__*/React__default.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: function onClick() {
                return self.handlingEdit(item);
              }
            }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.EditOutlined, null))), !("$type" in item[0]) ? /*#__PURE__*/React__default.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: function onClick() {
                return self.handlingAdd(path);
              }
            }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.PlusOutlined, null))) : null)
          });
        } else if (typeof item === "object" && !item.$type) {
            current.push({
              ptr: item,
              key: path,
              name: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Tooltip, {
                title: "This field is an object"
              }, /*#__PURE__*/React__default.createElement(antd.Tag, {
                color: "#722ed1"
              }, /*#__PURE__*/React__default.createElement(icons.UnorderedListOutlined, null))), /*#__PURE__*/React__default.createElement("strong", null, item.$_key)),
              doc: item.$doc,
              children: fieldify2antDataTable(item, path),
              actions: /*#__PURE__*/React__default.createElement("div", {
                className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
              }, /*#__PURE__*/React__default.createElement(antd.Popconfirm, {
                title: /*#__PURE__*/React__default.createElement("span", null, "Are you sure to delete Object ", /*#__PURE__*/React__default.createElement("strong", null, path)),
                onConfirm: function onConfirm() {
                  return self.itemRemove(item);
                },
                okText: "Yes",
                cancelText: "No"
              }, /*#__PURE__*/React__default.createElement("span", {
                className: "ant-radio-button-wrapper"
              }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.DeleteOutlined, null)))), /*#__PURE__*/React__default.createElement("span", {
                className: "ant-radio-button-wrapper",
                onClick: function onClick() {
                  return self.handlingEdit(item);
                }
              }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.EditOutlined, null))), /*#__PURE__*/React__default.createElement("span", {
                className: "ant-radio-button-wrapper",
                onClick: function onClick() {
                  return self.handlingAdd(path);
                }
              }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.PlusOutlined, null))))
            });
          } else if (item.$type) {
            var _TypeInfo = item.$type.Info;
            current.push({
              ptr: item,
              key: path,
              name: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(_TypeInfo, null), " ", item.$_key),
              doc: item.$doc,
              actions: /*#__PURE__*/React__default.createElement("div", {
                className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
              }, /*#__PURE__*/React__default.createElement(antd.Popconfirm, {
                title: /*#__PURE__*/React__default.createElement("span", null, "Are you sure to delete ", /*#__PURE__*/React__default.createElement("strong", null, path)),
                onConfirm: function onConfirm() {
                  return self.itemRemove(item);
                },
                okText: "Yes",
                cancelText: "No"
              }, /*#__PURE__*/React__default.createElement("span", {
                className: "ant-radio-button-wrapper"
              }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.DeleteOutlined, null)))), /*#__PURE__*/React__default.createElement("span", {
                className: "ant-radio-button-wrapper",
                onClick: function onClick() {
                  return self.handlingEdit(item);
                }
              }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.EditOutlined, null))))
            });
          }
      });
      return current;
    }

    var data = null;

    if (this.schema) {
      data = fieldify2antDataTable(this.schema.tree);
      return data;
    }

    return [];
  };

  _proto.render = function render() {
    var _this2 = this;

    var sds = this.state.schemaDataSource;
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(FieldifySchemaBuilderModal, {
      user: this.state.modalUser,
      visible: this.state.modal,
      onCancel: function onCancel() {
        return _this2.setState({
          modal: false
        });
      },
      onOk: this.itemChanged.bind(this)
    }), /*#__PURE__*/React__default.createElement(antd.Table, {
      columns: this.columns,
      dataSource: sds,
      size: "small",
      pagination: {
        total: sds.length,
        pageSize: sds.length,
        hideOnSinglePage: true
      },
      expandable: {
        defaultExpandAllRows: true
      }
    }));
  };

  return FieldifySchemaBuilder;
}(React__default.Component);

var FieldifySchemaRender = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(FieldifySchemaRender, _React$Component);

  function FieldifySchemaRender() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = FieldifySchemaRender.prototype;

  _proto.render = function render() {
    return /*#__PURE__*/React__default.createElement("div", null, "test");
  };

  return FieldifySchemaRender;
}(React__default.Component);

var schema = {
  __proto__: null,
  FieldifySchemaRender: FieldifySchemaRender,
  FieldifySchemaBuilder: FieldifySchemaBuilder,
  FieldifySchemaForm: FieldifySchemaForm,
  FieldifySchema: FieldifySchema
};

var Input = /*#__PURE__*/function (_input) {
  _inheritsLoose(Input, _input);

  function Input() {
    return _input.apply(this, arguments) || this;
  }

  return Input;
}(fieldify.input);
var Schema = schema;
var Types = types;

exports.Input = Input;
exports.Schema = Schema;
exports.Types = Types;
//# sourceMappingURL=index.js.map
