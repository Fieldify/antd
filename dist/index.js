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

var RecycledComponent = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(RecycledComponent, _React$Component);

  function RecycledComponent(props, context, updater) {
    var _this;

    _this = _React$Component.call(this, props, context, updater) || this;
    _this.state = _this.cycle(props, true);
    return _this;
  }

  var _proto = RecycledComponent.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(props, state) {
    if (_React$Component.prototype.componentDidUpdate) _React$Component.prototype.componentDidUpdate.call(this, props, state);
    var changed = false;

    for (var a in props) {
      if (typeof props[a] !== "function" && props[a] !== this.props[a]) {
        changed = true;
        break;
      }
    }

    if (changed === true) {
      var ret = this.cycle(this.props, false);
      if (ret && typeof ret === "object") this.setState(ret);
    }
  };

  _proto.cycle = function cycle(props, first) {
    return {};
  };

  return RecycledComponent;
}(React__default.Component);

var FieldifyTypeForm = /*#__PURE__*/function (_Component) {
  _inheritsLoose(FieldifyTypeForm, _Component);

  function FieldifyTypeForm(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = _this.cycle(props);
    return _this;
  }

  var _proto = FieldifyTypeForm.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(props, state) {
    if (this.props.schema !== props.schema) {
      var cycle = this.cycle(this.props);
      this.setState(cycle);
    }
  };

  _proto.cycle = function cycle(props) {
    this.schema = props.schema;
    var state = {
      value: props.value,
      verify: props.verify,
      feedback: false,
      status: null,
      options: {}
    };
    this.isInjected = props.isInjected;
    this.onChange = props.onChange ? props.onChange : function () {};
    this.onError = props.onError ? props.onError : function () {};

    if (!this.schema) {
      this.schema = {};
      return state;
    }

    state.help = this.schema.$help;
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

    speed = speed || 100;
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

    if (!this.handler) {
      return cb({
        status: "error",
        feedback: true,
        help: "No Handler on verifier"
      });
    }

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
    if (this.isInjected === true) return /*#__PURE__*/React__default.createElement(antd.Form.Item, {
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

var FieldifyTypeRender = /*#__PURE__*/function (_RecycledComponent) {
  _inheritsLoose(FieldifyTypeRender, _RecycledComponent);

  function FieldifyTypeRender() {
    return _RecycledComponent.apply(this, arguments) || this;
  }

  var _proto = FieldifyTypeRender.prototype;

  _proto.cycle = function cycle(props) {
    var state = {
      schema: props.schema,
      value: props.value,
      injected: props.injected
    };
    return state;
  };

  _proto.subRender = function subRender(children) {
    if (this.state.injected === true) {
      return /*#__PURE__*/React__default.createElement(antd.Form.Item, {
        label: this.state.schema.$doc,
        hasFeedback: true,
        validateStatus: "success",
        style: {
          marginBottom: "0px"
        },
        wrapperCol: {
          sm: 24
        }
      }, children);
    }

    return /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: this.state.schema.$doc,
      hasFeedback: true,
      validateStatus: "success"
    }, children);
  };

  _proto.render = function render() {
    return this.subRender( /*#__PURE__*/React__default.createElement("div", {
      style: {
        width: "100%"
      }
    }, this.state.value));
  };

  return FieldifyTypeRender;
}(RecycledComponent);

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

var StringRender = /*#__PURE__*/function (_TypeRender) {
  _inheritsLoose(StringRender, _TypeRender);

  function StringRender() {
    return _TypeRender.apply(this, arguments) || this;
  }

  return StringRender;
}(FieldifyTypeRender);

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
  Form: StringForm,
  Render: StringRender
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

var NameRender = /*#__PURE__*/function (_TypeRender) {
  _inheritsLoose(NameRender, _TypeRender);

  function NameRender() {
    return _TypeRender.apply(this, arguments) || this;
  }

  NameRender.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
    if (state.value && typeof state.value === "object") {
      var _final = "";
      if (state.value.first) _final += state.value.first;
      if (state.value.last) _final += " " + state.value.last;
      state.value = _final.trim();
    }

    return state;
  };

  return NameRender;
}(FieldifyTypeRender);

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
  Render: NameRender,
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

var EmailRender = /*#__PURE__*/function (_TypeRender) {
  _inheritsLoose(EmailRender, _TypeRender);

  function EmailRender() {
    return _TypeRender.apply(this, arguments) || this;
  }

  return EmailRender;
}(FieldifyTypeRender);

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
  Form: EmailForm,
  Render: EmailRender
};

var NumberForm = /*#__PURE__*/function (_TypeForm) {
  _inheritsLoose(NumberForm, _TypeForm);

  function NumberForm() {
    return _TypeForm.apply(this, arguments) || this;
  }

  var _proto = NumberForm.prototype;

  _proto.render = function render() {
    var _this = this;

    return _TypeForm.prototype.render.call(this, /*#__PURE__*/React__default.createElement(antd.InputNumber, {
      value: this.state.value,
      placeholder: this.state.options.placeholder,
      onChange: function onChange(value) {
        return _this.changeValue(value);
      },
      style: {
        width: "100%"
      }
    }));
  };

  return NumberForm;
}(FieldifyTypeForm);

var NumberInfo = /*#__PURE__*/function (_TypeInfo) {
  _inheritsLoose(NumberInfo, _TypeInfo);

  function NumberInfo() {
    return _TypeInfo.apply(this, arguments) || this;
  }

  var _proto2 = NumberInfo.prototype;

  _proto2.render = function render() {
    return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(antd.Tag, {
      color: "#ff7a45"
    }, /*#__PURE__*/React__default.createElement(icons.NumberOutlined, null)));
  };

  return NumberInfo;
}(SignderivaTypeInfo);

var NumberRender = /*#__PURE__*/function (_TypeRender) {
  _inheritsLoose(NumberRender, _TypeRender);

  function NumberRender() {
    return _TypeRender.apply(this, arguments) || this;
  }

  return NumberRender;
}(FieldifyTypeRender);

var NumberBuilder = /*#__PURE__*/function (_TypeBuilder) {
  _inheritsLoose(NumberBuilder, _TypeBuilder);

  function NumberBuilder(props) {
    var _this2;

    _this2 = _TypeBuilder.call(this, props) || this;
    _this2["default"] = {
      minSize: 1,
      maxSize: 128
    };

    _this2.configure();

    return _this2;
  }

  var _proto3 = NumberBuilder.prototype;

  _proto3.render = function render() {
    return /*#__PURE__*/React__default.createElement("div", null);
  };

  return NumberBuilder;
}(SignderivaTypeBuilder);

var Number = {
  code: fieldify.types.Number.code,
  description: fieldify.types.Number.description,
  "class": fieldify.types.Number["class"],
  Info: NumberInfo,
  Builder: NumberBuilder,
  Form: NumberForm,
  Render: NumberRender
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

    if (!_this.state.value && _this.state.options["default"]) {
      _this.state.value = _this.state.options["default"];

      _this.onChange(_this.schema, _this.state.value);
    }

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
      color: "#52c41a",
      style: {
        color: "white"
      }
    }, /*#__PURE__*/React__default.createElement(icons.SelectOutlined, null)));
  };

  return SelectInfo;
}(SignderivaTypeInfo);

var SelectRender = /*#__PURE__*/function (_TypeRender) {
  _inheritsLoose(SelectRender, _TypeRender);

  function SelectRender() {
    return _TypeRender.apply(this, arguments) || this;
  }

  SelectRender.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
    if (typeof state.value === "string") {
      if (props.schema.$options && props.schema.$options.items) {
        var ptr = props.schema.$options.items;
        if (ptr[state.value]) state.value = ptr[state.value];
      }
    }

    return state;
  };

  return SelectRender;
}(FieldifyTypeRender);

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
  Form: SelectForm,
  Render: SelectRender
};

var ObjectClass = /*#__PURE__*/function (_fieldifyType) {
  _inheritsLoose(ObjectClass, _fieldifyType);

  function ObjectClass() {
    return _fieldifyType.apply(this, arguments) || this;
  }

  return ObjectClass;
}(fieldify.fieldifyType);

var Object$1 = {
  code: "Object",
  description: "Nested Sub Object",
  "class": ObjectClass
};

var ArrayClass = /*#__PURE__*/function (_fieldifyType) {
  _inheritsLoose(ArrayClass, _fieldifyType);

  function ArrayClass() {
    return _fieldifyType.apply(this, arguments) || this;
  }

  var _proto = ArrayClass.prototype;

  _proto.configuration = function configuration() {
    return {
      min: {
        $doc: 'Minimum of items',
        $required: false,
        $type: 'Number'
      },
      max: {
        $doc: 'Maximun of items',
        $required: false,
        $type: 'Number'
      }
    };
  };

  return ArrayClass;
}(fieldify.fieldifyType);

var Array$1 = {
  code: "Array",
  description: "Array",
  "class": ArrayClass
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

var KVForm = /*#__PURE__*/function (_TypeForm) {
  _inheritsLoose(KVForm, _TypeForm);

  function KVForm(props) {
    return _TypeForm.call(this, props) || this;
  }

  var _proto = KVForm.prototype;

  _proto.cycle = function cycle(props) {
    var ret = _TypeForm.prototype.cycle.call(this, props);

    if (!ret.value) ret.value = {};
    this.result = _extends({}, ret.value);
    ret.modal = false;
    ret.modalCurrent = {
      key: "",
      value: ""
    };
    ret.dataTree = _extends({}, ret.value);
    ret.dataSource = this.computeDataSource(ret.dataTree);
    return ret;
  };

  _proto.computeDataSource = function computeDataSource(tree) {
    var _this = this;

    var ds = [];

    var _loop = function _loop(key) {
      var value = tree[key];
      ds.push({
        key: key,
        value: value,
        actions: /*#__PURE__*/React__default.createElement("div", {
          className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
        }, /*#__PURE__*/React__default.createElement("span", {
          className: "ant-radio-button-wrapper",
          onClick: function onClick() {
            return _this.removeKey(key);
          }
        }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.DeleteOutlined, null))), /*#__PURE__*/React__default.createElement("span", {
          className: "ant-radio-button-wrapper",
          onClick: function onClick() {
            return _this.openModal({
              key: key,
              value: value
            });
          }
        }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.EditOutlined, null))))
      });
    };

    for (var key in tree) {
      _loop(key);
    }

    return ds;
  };

  _proto.handleModalChange = function handleModalChange(key, value) {
    var modalCurrent = _extends({}, this.state.modalCurrent);

    modalCurrent[key] = value;
    this.setState({
      modalCurrent: modalCurrent
    });
  };

  _proto.openModal = function openModal(data) {
    var state = {
      modalError: false,
      modalInitial: null,
      modalCurrent: data || {
        key: "",
        value: ""
      },
      modal: true
    };
    if (data) state.modalInitial = _extends({}, state.modalCurrent);
    this.setState(state);
  };

  _proto.removeKey = function removeKey(key) {
    var state = _extends({}, this.state);

    delete state.dataTree[key];
    state.dataSource = this.computeDataSource(state.dataTree);
    this.setState(state);
    this.changeValue(state.dataTree);
  };

  _proto.editedButton = function editedButton() {
    var _this2 = this;

    var state = _extends({}, this.state);

    var mc = this.state.modalCurrent;
    var type = this.schema.$_type;
    var data = {};
    data[mc.key] = mc.value;
    type.verify(data, function (error, message) {
      state.modalError = error;
      state.modalErrorMessage = message;

      if (error === false) {
        if (state.modalInitial) {
          delete state.dataTree[state.modalInitial.key];
        }

        state.dataTree[state.modalCurrent.key] = state.modalCurrent.value;
        state.dataSource = _this2.computeDataSource(state.dataTree);
        state.modal = false;
      }

      _this2.setState(state);

      _this2.changeValue(state.dataTree);
    });
  };

  _proto.render = function render() {
    var _this3 = this;

    var onCancel = function onCancel() {
      _this3.setState({
        modal: false
      });
    };

    var columns = [{
      title: 'Key',
      dataIndex: 'key',
      key: 'key'
    }, {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    }, {
      title: /*#__PURE__*/React__default.createElement("div", {
        className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
      }, /*#__PURE__*/React__default.createElement("span", {
        className: "ant-radio-button-wrapper",
        onClick: function onClick() {
          return _this3.openModal();
        }
      }, /*#__PURE__*/React__default.createElement("span", null, "Add ", /*#__PURE__*/React__default.createElement(icons.PlusOutlined, null)))),
      dataIndex: 'actions',
      key: 'actions',
      align: "right"
    }];
    var layout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    };
    return _TypeForm.prototype.render.call(this, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Modal, {
      centered: true,
      closable: false,
      visible: this.state.modal,
      width: 300,
      onOk: this.editedButton.bind(this),
      onCancel: onCancel
    }, this.state.modalError === true ? /*#__PURE__*/React__default.createElement("div", {
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React__default.createElement(antd.Alert, {
      size: "small",
      message: this.state.modalErrorMessage,
      type: "error"
    })) : null, /*#__PURE__*/React__default.createElement(antd.Form, layout, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: "Key"
    }, /*#__PURE__*/React__default.createElement(antd.Input, {
      value: this.state.modalCurrent.key,
      onChange: function onChange(_ref) {
        var target = _ref.target;
        return _this3.handleModalChange("key", target.value);
      }
    })), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
      label: "Value"
    }, /*#__PURE__*/React__default.createElement(antd.Input, {
      value: this.state.modalCurrent.value,
      onChange: function onChange(_ref2) {
        var target = _ref2.target;
        return _this3.handleModalChange("value", target.value);
      }
    })))), /*#__PURE__*/React__default.createElement(antd.Table, {
      size: "small",
      dataSource: this.state.dataSource,
      columns: columns,
      pagination: {
        total: this.state.dataSource.length,
        pageSize: this.state.dataSource.length,
        hideOnSinglePage: true
      }
    })));
  };

  return KVForm;
}(FieldifyTypeForm);

var KVInfo = /*#__PURE__*/function (_TypeInfo) {
  _inheritsLoose(KVInfo, _TypeInfo);

  function KVInfo() {
    return _TypeInfo.apply(this, arguments) || this;
  }

  var _proto2 = KVInfo.prototype;

  _proto2.render = function render() {
    return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(antd.Tag, {
      color: "#22075e"
    }, /*#__PURE__*/React__default.createElement(icons.SmallDashOutlined, null)));
  };

  return KVInfo;
}(SignderivaTypeInfo);

var KVRender = /*#__PURE__*/function (_TypeRender) {
  _inheritsLoose(KVRender, _TypeRender);

  function KVRender() {
    return _TypeRender.apply(this, arguments) || this;
  }

  var _proto3 = KVRender.prototype;

  _proto3.cycle = function cycle(props) {
    var ret = _TypeRender.prototype.cycle.call(this, props);

    if (!ret.value) ret.value = {};
    this.result = _extends({}, ret.value);
    ret.dataTree = _extends({}, ret.value);
    ret.dataSource = this.computeDataSource(ret.dataTree);
    return ret;
  };

  _proto3.computeDataSource = function computeDataSource(tree) {
    var ds = [];

    for (var key in tree) {
      var value = tree[key];
      ds.push({
        key: key,
        value: value
      });
    }

    return ds;
  };

  _proto3.render = function render() {
    var columns = [{
      dataIndex: 'key',
      key: 'key'
    }, {
      dataIndex: 'value',
      key: 'value'
    }];
    return _TypeRender.prototype.subRender.call(this, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Table, {
      showHeader: false,
      size: "small",
      dataSource: this.state.dataSource,
      columns: columns,
      pagination: {
        total: this.state.dataSource.length,
        pageSize: this.state.dataSource.length,
        hideOnSinglePage: true
      }
    })));
  };

  return KVRender;
}(FieldifyTypeRender);

var KVBuilder = /*#__PURE__*/function (_TypeBuilder) {
  _inheritsLoose(KVBuilder, _TypeBuilder);

  function KVBuilder(props) {
    var _this4;

    _this4 = _TypeBuilder.call(this, props) || this;
    _this4["default"] = {
      minSize: 1,
      maxSize: 128
    };

    _this4.configure();

    return _this4;
  }

  var _proto4 = KVBuilder.prototype;

  _proto4.render = function render() {
    return /*#__PURE__*/React__default.createElement("div", null);
  };

  return KVBuilder;
}(SignderivaTypeBuilder);

var KV = {
  code: fieldify.types.KV.code,
  description: fieldify.types.KV.description,
  "class": fieldify.types.KV["class"],
  Info: KVInfo,
  Builder: KVBuilder,
  Form: KVForm,
  Render: KVRender
};

var types = {
  Name: Name,
  Email: Email,
  String: String,
  Number: Number,
  Select: Select,
  Checkbox: Checkbox,
  Object: Object$1,
  Array: Array$1,
  FieldName: FieldName,
  KV: KV
};

var FieldifySchema = /*#__PURE__*/function (_schema) {
  _inheritsLoose(FieldifySchema, _schema);

  function FieldifySchema(name, options) {
    return _schema.call(this, name, options) || this;
  }

  var _proto = FieldifySchema.prototype;

  _proto.resolver = function resolver(type) {
    return types[type];
  };

  _proto.compile = function compile(schema) {
    _schema.prototype.compile.call(this, schema);
  };

  return FieldifySchema;
}(fieldify.schema);

var FieldifySchemaForm = /*#__PURE__*/function (_RecycledComponent) {
  _inheritsLoose(FieldifySchemaForm, _RecycledComponent);

  function FieldifySchemaForm(props) {
    var _this;

    _this = _RecycledComponent.call(this, props) || this;
    _this.formRef = React__default.createRef();
    return _this;
  }

  var _proto = FieldifySchemaForm.prototype;

  _proto.cycle = function cycle(props, first) {
    var state = {};
    state.rawSchema = props.schema;
    state.schema = new FieldifySchema("form");
    state.schema.compile(state.rawSchema);
    state.rawInput = props.input;
    state.input = new fieldify.input(state.schema);
    state.input.setValue(props.input);
    state.inputValue = state.input.getValue();
    state.verify = props.verify || false;
    state.reactive = this.update(state.schema, state.inputValue, state.verify);
    this.references = {};
    this.onChange = props.onChange ? props.onChange : function () {};
    return state;
  };

  _proto.getValue = function getValue() {
    return this.state.input.getValue();
  };

  _proto.clickAddArray = function clickAddArray(line) {
    this.state.input.set(line);

    var _value = this.state.input.getValue();

    this.onChange(this.state.input, _value);
    this.setState({
      inputValue: _value,
      reactive: this.update(this.state.schema, _value, false)
    });
  };

  _proto.clickRemoveArrayItem = function clickRemoveArrayItem(line) {
    this.state.input.remove(line);

    var _value = this.state.input.getValue();

    this.onChange(this.state.input, _value);
    this.setState({
      inputValue: _value,
      reactive: this.update(this.state.schema, _value, false)
    });
  };

  _proto.setValue = function setValue(line, value) {
    if (!this.state.input) return;
    this.state.input.set(line, value);

    var _value = this.state.input.getValue();

    this.onChange(this.state.input, _value);
    this.setState({
      inputValue: _value
    });
  };

  _proto.update = function update(root, input, verify) {
    var _this2 = this;

    var follower = function follower(schema, schematized, input, ret, line) {
      line = line || "";
      fieldify.utils.orderedRead(schema, function (index, item) {
        var source = _extends({}, Array.isArray(item) ? item[0] : item);

        var schematizedSrc = schematized[source.$_key];

        var sourceSchematized = _extends({}, Array.isArray(schematizedSrc) ? schematizedSrc[0] : schematizedSrc);

        var inputPtr = input ? input[source.$_key] : null;
        var lineKey = line + "." + source.$_key;

        if (source.$_array === true) {
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
          var inputPtr2 = inputPtr;
          var options = source.$array || {};
          var min = options.min ? options.min : source.$required === true ? 1 : 0;

          if (source.$_nested === true) {
            var inputPtr2 = input[source.$_key];
            if (!Array.isArray(inputPtr)) inputPtr2 = input[source.$_key] = [];

            if (min - inputPtr2.length > 0) {
              for (var a = 0; a <= min - inputPtr2.length; a++) {
                inputPtr2.push({});
              }
            }

            var _loop = function _loop() {
              var value = inputPtr2[a];
              var key = lineKey + "." + a;
              var child = [];
              follower(source, sourceSchematized, value, child, key);
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
              _loop();
            }
          } else if (source.$type) {
            delete sourceSchematized.$doc;
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

            var _loop2 = function _loop2() {
              var value = inputPtr2[a];
              var key = lineKey + "." + a;
              dataSource.push({
                key: key,
                form: /*#__PURE__*/React__default.createElement(TypeForm, {
                  schema: sourceSchematized,
                  value: value,
                  verify: verify,
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
          }

          ret.push( /*#__PURE__*/React__default.createElement(antd.Form.Item, {
            key: source.$_wire,
            noStyle: true
          }, /*#__PURE__*/React__default.createElement("div", {
            className: "ant-form-item"
          }, /*#__PURE__*/React__default.createElement(antd.Card, {
            size: "small",
            title: source.$_access.$doc,
            extra: /*#__PURE__*/React__default.createElement("div", {
              className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
            }, inputPtr2 ? /*#__PURE__*/React__default.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: function onClick() {
                return _this2.clickAddArray(lineKey + "." + inputPtr2.length);
              }
            }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.PlusOutlined, null))) : null)
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
        } else {
          if (source.$_nested === true) {
            var child = [];
            follower(source, sourceSchematized, inputPtr, child, lineKey);
            ret.push( /*#__PURE__*/React__default.createElement("div", {
              key: source.$_wire,
              className: "ant-form-item"
            }, /*#__PURE__*/React__default.createElement(antd.Card, {
              size: "small",
              title: source.$doc
            }, child)));
          } else if (item.$type) {
            var _TypeForm = item.$type.Form;
            ret.push( /*#__PURE__*/React__default.createElement(_TypeForm, {
              schema: sourceSchematized,
              value: inputPtr,
              key: source.$_wire,
              verify: verify,
              user: _this2.props.user,
              onChange: function onChange(schema, value) {
                return _this2.setValue(lineKey, value);
              },
              onError: function onError(error, message) {
                if (error === true) {
                  _this2.references[source.$_wire] = message;
                } else {
                  var ref = _this2.references[source.$_wire];

                  if (ref) {
                    delete _this2.references[source.$_wire];
                  }
                }
              }
            }));
          }
        }
      });
      return ret;
    };

    var ret = [];
    follower(root.handler.schema, root.handlerSchematized.schema, input, ret);
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
    return /*#__PURE__*/React__default.createElement(antd.Form, _extends({
      key: this.formRef
    }, layout, {
      name: "basic"
    }), this.state.reactive);
  };

  return FieldifySchemaForm;
}(RecycledComponent);

var allTypes = {};
var allTypesNoArray = {};

for (var a in types) {
  allTypes[a] = types[a].description;

  if (a !== "Array") {
    allTypesNoArray[a] = types[a].description;
  }
}

var baseSchema = {
  key: {
    $doc: "Name of the field",
    $type: types.FieldName,
    $required: true,
    $position: 10
  },
  type: {
    $doc: "Field type",
    $type: "Select",
    $required: true,
    $options: {
      items: allTypes
    },
    $position: 11
  },
  doc: {
    $doc: "Description",
    $required: false,
    $type: "String",
    $position: 22
  },
  position: {
    $doc: "Position in the serie",
    $required: false,
    $type: "Number",
    $default: 0,
    $options: {
      acceptedTypes: "integer"
    },
    $position: 23
  }
};
var FieldifySchemaBuilderModal = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(FieldifySchemaBuilderModal, _React$Component);

  function FieldifySchemaBuilderModal(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.formRef = React__default.createRef();
    _this.state = _this.cycle(props, true);
    _this.currentSchema = baseSchema;
    return _this;
  }

  var _proto = FieldifySchemaBuilderModal.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(props) {
    var changed = false;

    var state = _extends({}, this.state);

    if (this.props.visible !== props.visible) {
      this.currentSchema = baseSchema;
      state = this.cycle(this.props);
      changed = true;
    }

    if (changed === true) this.setState(state);
  };

  _proto.cycle = function cycle(props, first) {
    var state = {
      edition: false,
      original: props.value,
      form: {
        state: "Filling",
        color: "blue"
      },
      value: {},
      visible: props.visible,
      user: props.user,
      verify: false
    };

    if (state.user && state.user.$_wire) {
      state.initialPath = state.user.$_wire;
    } else state.initialPath = '';

    if (props.value) {
      var val = props.value;
      state.edition = true;

      if (val.$_array !== true && val.$_nested !== true) {
        state.value = {
          key: val.$_key,
          type: val.$type.code,
          doc: val.$doc,
          required: val.$required,
          read: val.$read,
          write: val.$write,
          options: val.$options,
          position: val.$position
        };
      } else if (val.$_array === true && val.$_nested === true) {
          state.value = {
            key: val.$_key,
            type: "Array",
            content: "Object",
            doc: val.$doc,
            required: val.$required,
            read: val.$read,
            write: val.$write,
            options: val.$options,
            position: val.$position
          };
        } else if (val.$_array === true && val.$_nested !== true) {
            state.value = {
              key: val.$_key,
              type: "Array",
              content: typeof val.$type === "string" ? val.$type : val.$type.code,
              doc: val.$doc,
              required: val.$required,
              read: val.$read,
              write: val.$write,
              options: val.$options,
              position: val.$position
            };
          } else if (val.$_array !== true && val.$_nested === true) {
              state.value = {
                key: val.$_key,
                type: "Object",
                doc: val.$doc,
                required: val.$required,
                read: val.$read,
                write: val.$write,
                options: val.$options,
                position: val.$position
              };
            }
    } else {
        state.value = {};
      }

    this.driveSchema(state);
    state.input.setValue(state.value);
    return state;
  };

  _proto.driveSchema = function driveSchema(state, force) {
    var value = state.value;
    var Type = types[value.type];

    if (Type && Type !== this.currentType) {
      var TypeObject = new Type["class"]();
      var configuration = TypeObject.configuration();
      this.currentSchema = _extends({}, baseSchema);

      if (value.type === "Array") {
        this.currentSchema.content = {
          $doc: "Item content type",
          $type: "Select",
          $required: true,
          $options: {
            "default": value.content || "Object",
            items: allTypesNoArray
          },
          $position: 12
        };
      }

      if (configuration) this.currentSchema.options = _extends({}, configuration, {
        $doc: "Type configuration"
      });
      state.currentType = Type;
      state.schema = new FieldifySchema("modal");
      state.schema.compile(this.currentSchema);
      state.input = new fieldify.input(state.schema);
    } else {
      state.schema = new FieldifySchema("modal");
      state.schema.compile(this.currentSchema);
      state.input = new fieldify.input(state.schema);
    }
  };

  _proto.formChanged = function formChanged(value) {
    var _this2 = this;

    var state = {
      schema: this.state.schema,
      input: this.state.input,
      value: _extends({}, this.state.value, value)
    };
    this.driveSchema(state);
    state.input.setValue(state.value);
    this.setState(state);
    state.input.verify(function (result) {
      var state = {
        form: {}
      };
      state.verify = true;
      state.error = result.error;

      if (result.error === true) {
        state.form.color = "blue";
        state.form.state = "Filling";
      } else {
        state.form.color = "green";
        state.form.state = "Passed";
      }

      _this2.setState(state);
    });
  };

  _proto.handleOK = function handleOK() {
    var _this3 = this;

    this.state.input.verify(function (result) {
      var state = {
        form: {}
      };
      state.verify = true;
      state.error = result.error;

      if (result.error === true) {
        state.form.color = "red";
        state.form.state = "Error";
      } else {
        state.form.color = "green";
        state.form.state = "Passed";

        _this3.setState(state);

        var value = result.result;
        var nvalue = {};

        for (var key in value) {
          nvalue['$' + key] = value[key];
        }

        var source = _this3.state.initialPath.split('.');

        source.pop();
        source.push(value.key);
        var npath = source.join('.');
        delete nvalue.$key;

        if (nvalue.$type === "Array" && nvalue.$content === "Object") {
          if (_this3.state.edition === true) {
            if (_this3.props.user.$_wire) {
              var no = fieldify.utils.getNO(_this3.props.user);

              for (var a in no.nestedObject) {
                var p = no.nestedObject[a];
                nvalue[p[0]] = p[1];
              }
            }
          } else if (!nvalue.$doc) nvalue.$doc = "";

          delete nvalue.$type;
          delete nvalue.$content;
          nvalue = [nvalue];
        } else if (nvalue.$type === "Array" && nvalue.$content !== "Object") {
            nvalue.$type = nvalue.$content;
            delete nvalue.$content;
            nvalue = [nvalue];
          } else if (nvalue.$type === "Object") {
              if (_this3.state.edition === true) {
                if (_this3.props.user.$_wire) {
                  var _no = fieldify.utils.getNO(_this3.props.user);

                  for (var a in _no.nestedObject) {
                    var _p = _no.nestedObject[a];
                    nvalue[_p[0]] = _p[1];
                  }
                }
              } else if (!nvalue.$doc) nvalue.$doc = "";

              delete nvalue.$type;
            }

        if (_this3.state.edition === true) {
          _this3.props.onOk({
            edition: true,
            oldPath: _this3.state.initialPath,
            newPath: npath,
            key: value.key,
            value: nvalue
          });
        } else {
          _this3.props.onOk({
            edition: false,
            newPath: _this3.state.initialPath + "." + value.key,
            key: value.key,
            value: nvalue
          });
        }
      }
    });
  };

  _proto.render = function render() {
    var _this4 = this;

    var onCancel = function onCancel() {
      _this4.props.onCancel(_this4.state);
    };
    return /*#__PURE__*/React__default.createElement(antd.Modal, {
      title: /*#__PURE__*/React__default.createElement("span", null, "Add New Field To Your Schema ", /*#__PURE__*/React__default.createElement(antd.Tag, {
        color: this.state.form.color
      }, this.state.form.state)),
      centered: true,
      visible: this.state.visible,
      width: 600,
      onOk: this.handleOK.bind(this),
      onCancel: onCancel
    }, /*#__PURE__*/React__default.createElement(FieldifySchemaForm, {
      ref: this.formRef,
      schema: this.currentSchema,
      input: this.state.value,
      user: this.props.user,
      verify: this.state.verify,
      onChange: this.formChanged.bind(this)
    }));
  };

  return FieldifySchemaBuilderModal;
}(React__default.Component);

var FieldifySchemaBuilder = /*#__PURE__*/function (_RecycledComponent) {
  _inheritsLoose(FieldifySchemaBuilder, _RecycledComponent);

  function FieldifySchemaBuilder() {
    return _RecycledComponent.apply(this, arguments) || this;
  }

  var _proto = FieldifySchemaBuilder.prototype;

  _proto.cycle = function cycle(props, first) {
    var _this = this;

    var state = {
      modal: false,
      modalUser: null,
      schemaDataSource: []
    };

    this.onChange = function () {};

    if (props.onChange) this.onChange = props.onChange;
    state.schema = new FieldifySchema("form");
    state.schema.compile(props.schema);
    state.schemaDataSource = this.updateDataSource(state.schema);
    this.columns = [{
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
      }, /*#__PURE__*/React__default.createElement("span", null, "Add ", /*#__PURE__*/React__default.createElement(icons.PlusOutlined, null)))),
      dataIndex: 'actions',
      key: 'actions',
      align: "right"
    }];
    return state;
  };

  _proto.fireOnChange = function fireOnChange() {
    var ex = this.state.schema["export"]();
    this.onChange(ex);
  };

  _proto.itemChanged = function itemChanged(arg) {
    if (arg.edition === true) {
      var lineup = this.state.schema.getLineup(arg.oldPath);
      this.state.schema.removeLineup(arg.oldPath);
      this.state.schema.setLineup(arg.newPath, arg.value);
      antd.notification.success({
        message: "Field updated",
        description: "Field at " + arg.oldPath + " has been successfully updated"
      });
    } else {
        this.state.schema.setLineup(arg.newPath, arg.value);
        antd.notification.success({
          message: "Field added",
          description: "Field at " + arg.newPath + " has been successfully added"
        });
      }

    this.fireOnChange();
    this.setState({
      modal: false,
      modalContent: null,
      modalUser: null,
      schemaDataSource: this.updateDataSource(this.state.schema)
    });
  };

  _proto.itemRemove = function itemRemove(item) {
    this.state.schema.removeLineup(item.$_wire);
    this.fireOnChange();
    this.setState({
      schemaDataSource: this.updateDataSource(this.state.schema)
    });
    antd.notification.success({
      message: "Field removed",
      description: "Field at " + item.$_wire + " has been successfully removed"
    });
  };

  _proto.handlingAdd = function handlingAdd(path) {
    path = path || ".";
    var lineup = this.state.schema.getLineup(path) || this.state.schema.handler.schema;
    var state = {
      modal: true,
      modalContent: null,
      modalUser: lineup
    };
    this.setState(state);
  };

  _proto.handlingEdit = function handlingEdit(item) {
    var path = item.$_wire || ".";
    var lineup = this.state.schema.getLineup(path) || this.state.schema.handler.schema;
    var state = {
      modal: true,
      modalContent: item,
      modalUser: lineup
    };
    this.setState(state);
  };

  _proto.updateDataSource = function updateDataSource(root) {
    var self = this;

    function fieldify2antDataTable(schema, wire) {
      if (!wire) wire = "";
      var current = [];
      fieldify.utils.orderedRead(schema, function (index, item) {
        var path = wire + "." + item.$_key;
        item.$_path = path;

        if (Array.isArray(item)) {
          path = wire + "." + item[0].$_key;
          item[0].$_path = path;
          item[0].$_array = true;
          var composite = /*#__PURE__*/React__default.createElement(antd.Tooltip, {
            title: "... of objects"
          }, /*#__PURE__*/React__default.createElement(antd.Tag, {
            color: "#722ed1"
          }, /*#__PURE__*/React__default.createElement(icons.UnorderedListOutlined, null)));

          if ("$type" in item[0]) {
            var TypeInfo = item[0].$type.Info;
            composite = /*#__PURE__*/React__default.createElement(TypeInfo, null);
          } else {
            item[0].$_nested = true;
          }

          current.push({
            ptr: item[0],
            key: path,
            name: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Tooltip, {
              title: "This field is an array ..."
            }, /*#__PURE__*/React__default.createElement(antd.Tag, {
              color: "#eb2f96"
            }, /*#__PURE__*/React__default.createElement(icons.CopyOutlined, null))), composite, /*#__PURE__*/React__default.createElement("strong", null, item[0].$_key)),
            doc: item[0].$doc,
            children: !("$type" in item[0]) ? fieldify2antDataTable(item[0], path) : null,
            actions: /*#__PURE__*/React__default.createElement("div", {
              className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
            }, /*#__PURE__*/React__default.createElement(antd.Popconfirm, {
              title: /*#__PURE__*/React__default.createElement("span", null, "Are you sure to delete the Array ", /*#__PURE__*/React__default.createElement("strong", null, path)),
              onConfirm: function onConfirm() {
                return self.itemRemove(item[0]);
              },
              okText: "Yes",
              cancelText: "No"
            }, /*#__PURE__*/React__default.createElement("span", {
              className: "ant-radio-button-wrapper"
            }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.DeleteOutlined, null)))), /*#__PURE__*/React__default.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: function onClick() {
                return self.handlingEdit(item[0]);
              }
            }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.EditOutlined, null))), !("$type" in item[0]) ? /*#__PURE__*/React__default.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: function onClick() {
                return self.handlingAdd(path);
              }
            }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement(icons.PlusOutlined, null))) : null)
          });
        } else if (typeof item === "object" && !item.$type) {
            item.$_nested = true;
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
          } else {
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

    if (root) {
      data = fieldify2antDataTable(root.handler.schema);
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
      value: this.state.modalContent,
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
}(RecycledComponent);

var FieldifySchemaRender = /*#__PURE__*/function (_RecycledComponent) {
  _inheritsLoose(FieldifySchemaRender, _RecycledComponent);

  function FieldifySchemaRender(props) {
    var _this;

    _this = _RecycledComponent.call(this, props) || this;
    _this.formRef = React__default.createRef();
    return _this;
  }

  var _proto = FieldifySchemaRender.prototype;

  _proto.cycle = function cycle(props, first) {
    var state = {
      input: props.input,
      layout: props.layout ? props.layout : "horizontal"
    };
    this.schema = props.schema;
    state.verify = props.verify || false;
    state.reactive = this.update(state.input, state.verify);
    this.references = {};
    this.onChange = props.onChange ? props.onChange : function () {};
    return state;
  };

  _proto.update = function update(input, verify) {
    var follower = function follower(schema, input, ret, line) {
      line = line || "";
      fieldify.utils.orderedRead(schema, function (index, item) {
        var source = _extends({}, Array.isArray(item) ? item[0] : item);

        var inputPtr = input ? input[source.$_key] : null;
        var lineKey = line + "." + source.$_key;

        if (source.$_array === true) {
          var columns = [{
            dataIndex: 'form',
            key: 'form',
            width: "100%"
          }];
          var dataSource = [];
          var inputPtr2 = inputPtr;
          var options = source.$array || {};
          var min = options.min ? options.min : source.$required === true ? 1 : 0;

          if (source.$_nested === true) {
            var inputPtr2 = input[source.$_key];
            if (!Array.isArray(inputPtr)) inputPtr2 = input[source.$_key] = [];

            if (min - inputPtr2.length > 0) {
              for (var a = 0; a <= min - inputPtr2.length; a++) {
                inputPtr2.push({});
              }
            }

            for (var a = 0; a < inputPtr2.length; a++) {
              var value = inputPtr2[a];
              var key = lineKey + "." + a;
              var child = [];
              follower(source, value, child, key);
              dataSource.push({
                key: key,
                form: child
              });
            }
          } else {
            delete source.$doc;
            var TypeRender = source.$type.Render;

            if (TypeRender) {
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

              for (var a = 0; a < inputPtr2.length; a++) {
                var _value = inputPtr2[a];

                var _key = lineKey + "." + a;

                dataSource.push({
                  key: _key,
                  form: /*#__PURE__*/React__default.createElement(TypeRender, {
                    schema: source,
                    value: _value,
                    injected: true,
                    key: "render." + source.$_wire
                  })
                });
              }
            }
          }

          ret.push( /*#__PURE__*/React__default.createElement(antd.Form.Item, {
            key: source.$_wire,
            noStyle: true
          }, /*#__PURE__*/React__default.createElement("div", {
            className: "ant-form-item"
          }, /*#__PURE__*/React__default.createElement(antd.Card, {
            size: "small",
            title: source.$_access.$doc
          }, /*#__PURE__*/React__default.createElement(antd.Table, {
            size: "small",
            dataSource: dataSource,
            columns: columns,
            showHeader: false,
            pagination: {
              total: dataSource.length,
              pageSize: dataSource.length,
              hideOnSinglePage: true
            }
          })))));
        } else {
          if (source.$_nested === true) {
            var _child = [];
            follower(source, inputPtr, _child, lineKey);
            ret.push( /*#__PURE__*/React__default.createElement("div", {
              key: "render." + source.$_wire,
              className: "ant-form-item"
            }, /*#__PURE__*/React__default.createElement(antd.Card, {
              size: "small",
              title: source.$doc
            }, _child)));
          } else {
            var _TypeRender = item.$type.Render;

            if (_TypeRender) {
              ret.push( /*#__PURE__*/React__default.createElement(_TypeRender, {
                schema: source,
                value: inputPtr,
                key: "render." + source.$_wire
              }));
            }
          }
        }
      });
      return ret;
    };

    var ret = [];
    follower(this.schema.handler.schema, input, ret);
    return ret;
  };

  _proto.render = function render() {
    var layout = {};

    if (this.state.layout === 'horizontal') {
      layout = {
        labelCol: {
          span: 8
        },
        wrapperCol: {
          span: 16
        }
      };
    }

    return /*#__PURE__*/React__default.createElement(antd.Form, _extends({
      layout: this.state.layout,
      key: this.formRef
    }, layout, {
      name: "basic"
    }), this.state.reactive);
  };

  return FieldifySchemaRender;
}(RecycledComponent);



var schema = {
  __proto__: null,
  FieldifySchemaBuilder: FieldifySchemaBuilder,
  FieldifySchemaForm: FieldifySchemaForm,
  FieldifySchemaRender: FieldifySchemaRender,
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
