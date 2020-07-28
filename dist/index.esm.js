import { types as types$1, fieldifyType, schema as schema$1, input, utils } from 'fieldify';
import React, { Component } from 'react';
import RecycledComponent from 'react-recycling';
import { Form, Input as Input$1, Tag, Space, InputNumber, Row, Col, Checkbox as Checkbox$1, DatePicker as DatePicker$1, TimePicker as TimePicker$1, Select as Select$1, Radio as Radio$1, Modal, Alert, Table, Card, Button, notification, Tooltip, Popconfirm } from 'antd';
import { FieldStringOutlined, UserSwitchOutlined, MailOutlined, NumberOutlined, CheckSquareOutlined, FieldTimeOutlined, SelectOutlined, FieldBinaryOutlined, SmallDashOutlined, PlusOutlined, DeleteOutlined, EditOutlined, LinkOutlined, CopyOutlined, UnorderedListOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

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

class FieldifyTypeForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.cycle(props);
  }

  componentDidUpdate(props, state) {
    if (this.props.schema !== props.schema) {
      var cycle = this.cycle(this.props);
      this.setState(cycle);
    }
  }

  cycle(props) {
    this.schema = props.schema;
    var state = {
      value: props.value,
      verify: props.verify,
      feedback: false,
      status: null,
      options: {}
    };
    this.isInjected = props.isInjected;
    this.onChange = props.onChange ? props.onChange : () => {};
    this.onError = props.onError ? props.onError : () => {};

    if (!this.schema) {
      this.schema = {};
      return state;
    }

    state.help = this.schema.$help;
    state.options = this.schema.$options || {};
    this.handler = this.schema.$_type;
    return state;
  }

  timedChange(cb, speed) {
    if (this._changeTimer) {
      this._changeTimerQueue++;
      this._changeTimerCb = cb;
      return;
    }

    cb = cb || this._changeTimerCb;
    if (!cb) return;
    delete this._changeTimerCb;
    this._changeTimerQueue = 0;
    this._changeTimer = setTimeout(() => {
      cb(() => {
        delete this._changeTimer;

        if (this._changeTimerQueue > 0) {
          this.timedChange(cb, speed);
        }
      });
    }, speed);
  }

  changeValue(value, speed) {
    speed = speed || 100;
    this.setState({
      value: value
    });
    this._lastValue = value;
    this.timedChange(end => {
      this.verify(this._lastValue, ret => {
        this.setState(ret);

        if (ret.status !== "success") {
          end();
          return;
        }

        this.onChange(this.schema, this._lastValue);
        end();
      });
    }, speed);
  }

  verify(value, cb) {
    if (!this.handler) {
      return cb({
        status: "error",
        feedback: true,
        help: "No Handler on verifier"
      });
    }

    this.handler.verify(value, (error, message) => {
      if (error === false) {
        this.onError(false);
        return cb({
          status: "success",
          feedback: true,
          help: null
        });
      }

      this.onError(true, message);
      return cb({
        status: "error",
        feedback: true,
        help: message
      });
    });
  }

  render(children) {
    if (this.isInjected === true) return /*#__PURE__*/React.createElement(Form.Item, {
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
    return /*#__PURE__*/React.createElement(Form.Item, {
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
  }

}

class FieldifyTypeRender extends RecycledComponent {
  cycle(props) {
    var state = {
      schema: props.schema,
      value: props.value,
      injected: props.injected
    };
    return state;
  }

  subRender(children) {
    if (this.state.injected === true) {
      return /*#__PURE__*/React.createElement(Form.Item, {
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

    return /*#__PURE__*/React.createElement(Form.Item, {
      label: this.state.schema.$doc,
      hasFeedback: true,
      validateStatus: "success"
    }, children);
  }

  render() {
    return this.subRender( /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%"
      }
    }, this.state.value));
  }

}

class SignderivaTypeInfo extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    if (props.match) this.path = props.match.path;
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState) {
  }

}

class SignderivaTypeBuilder extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.onChange = props.onChange ? props.onChange : () => {};
    if (props.match) this.path = props.match.path;
    this.state = _extends({}, props.options);
    this.default = {};
  }

  componentDidUpdate(prevProps, prevState) {
    var pNew = this.props.options || {};
    var pOld = prevProps.options || {};
    var changed = 0;

    for (var key in this.default) {
      var o = pOld[key];
      var n = pNew[key];
      if (o !== n) changed++;
    }

    if (changed > 0) {
      this.setState(pNew);
      this.onChange(_extends({}, pNew));
    }
  }

  setup(prev) {
    var state = _extends({}, prev);

    for (var a in state) {
      var p = this.default[a];
      if (!p) delete state[a];
    }

    for (var a in this.default) {
      if (!(a in state)) state[a] = this.default[a];
    }

    return state;
  }

  configure() {
    this.state = this.setup(this.state);
    this.onChange(_extends({}, this.state));
  }

  changeIt(key, value) {
    var change = Object.assign({}, this.state);
    change[key] = value;
    this.setState(change);
    this.onChange(_extends({}, change));
  }

}

class StringForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(Input$1, {
      value: this.state.value,
      placeholder: this.state.options.placeholder,
      onChange: (_ref) => {
        var {
          target
        } = _ref;
        return this.changeValue(target.value);
      },
      style: {
        width: "100%"
      }
    }));
  }

}

class StringRender extends FieldifyTypeRender {}

class StringInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#fadb14",
      style: {
        color: "#555555"
      }
    }, /*#__PURE__*/React.createElement(FieldStringOutlined, null)));
  }

}

class StringBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.default = {
      minSize: 1,
      maxSize: 128
    };
    this.configure();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Item, {
      label: "String min/max size"
    }, /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(InputNumber, {
      min: 0,
      value: this.state.minSize,
      onChange: value => this.changeIt("minSize", value)
    }), /*#__PURE__*/React.createElement(InputNumber, {
      min: 0,
      value: this.state.maxSize,
      onChange: value => this.changeIt("maxSize", value)
    }))));
  }

}

var String = {
  code: types$1.String.code,
  description: types$1.String.description,
  class: types$1.String.class,
  Info: StringInfo,
  Builder: StringBuilder,
  Form: StringForm,
  Render: StringRender
};

var StringForm$1 = String.Form;

class NameForm extends FieldifyTypeForm {
  constructor(props) {
    super(props);
  }

  cycle(props) {
    var ret = super.cycle(props);
    if (!ret.value) ret.value = {};
    this.result = _extends({}, ret.value);
    return ret;
  }

  error(from, error, message) {}

  setField(key, schema, value) {
    this.result[key] = value;
    this.onChange(this.schema, this.result);
  }

  render() {
    return super.render( /*#__PURE__*/React.createElement(Row, {
      gutter: 16
    }, /*#__PURE__*/React.createElement(Col, {
      className: "gutter-row",
      span: 12
    }, /*#__PURE__*/React.createElement(StringForm$1, {
      schema: this.schema.first,
      verify: this.state.verify,
      value: this.state.value.first,
      onChange: (schema, value) => this.setField("first", schema, value),
      isInjected: true
    })), /*#__PURE__*/React.createElement(Col, {
      className: "gutter-row",
      span: 12
    }, /*#__PURE__*/React.createElement(StringForm$1, {
      schema: this.schema.last,
      verify: this.state.verify,
      value: this.state.value.last,
      onChange: (schema, value) => this.setField("last", schema, value),
      isInjected: true
    }))));
  }

}

class NameInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#36cfc9",
      style: {
        color: "#555555"
      }
    }, /*#__PURE__*/React.createElement(UserSwitchOutlined, null)));
  }

}

class NameRender extends FieldifyTypeRender {
  static getDerivedStateFromProps(props, state) {
    if (state.value && typeof state.value === "object") {
      var final = "";
      if (state.value.first) final += state.value.first;
      if (state.value.last) final += " " + state.value.last;
      state.value = final.trim();
    }

    return state;
  }

}

class NameBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.default = {
      minSize: 1,
      maxSize: 128
    };
    this.configure();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Item, {
      label: "Name min/max size"
    }, /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(InputNumber, {
      min: 0,
      value: this.state.minSize,
      onChange: value => this.changeIt("minSize", value)
    }), /*#__PURE__*/React.createElement(InputNumber, {
      min: 0,
      value: this.state.maxSize,
      onChange: value => this.changeIt("maxSize", value)
    }))));
  }

}

var Name = {
  code: types$1.Name.code,
  description: types$1.Name.description,
  class: types$1.Name.class,
  Info: NameInfo,
  Builder: NameBuilder,
  Form: NameForm,
  Render: NameRender,
  noFormItem: true
};

class EmailForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(Input$1, {
      value: this.state.value,
      placeholder: this.state.options.placeholder,
      onChange: (_ref) => {
        var {
          target
        } = _ref;
        return this.changeValue(target.value);
      }
    }));
  }

}

class EmailInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#1890ff"
    }, /*#__PURE__*/React.createElement(MailOutlined, null)));
  }

}

class EmailRender extends FieldifyTypeRender {}

class EmailBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.default = {
      subAddressing: true
    };
    this.configure();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Item, {
      label: "Sub-addressing"
    }, /*#__PURE__*/React.createElement(Checkbox$1, {
      checked: this.state.subAddressing,
      onChange: (_ref2) => {
        var {
          target
        } = _ref2;
        return this.changeIt("subAddressing", target.checked);
      }
    }, "Allowed")));
  }

}

var Email = {
  code: types$1.Email.code,
  description: types$1.Email.description,
  class: types$1.Email.class,
  Info: EmailInfo,
  Builder: EmailBuilder,
  Form: EmailForm,
  Render: EmailRender
};

class NumberForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(InputNumber, {
      value: this.state.value,
      placeholder: this.state.options.placeholder,
      onChange: value => this.changeValue(value),
      style: {
        width: "100%"
      }
    }));
  }

}

class NumberInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#ff7a45"
    }, /*#__PURE__*/React.createElement(NumberOutlined, null)));
  }

}

class NumberRender extends FieldifyTypeRender {}

class NumberBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.default = {
      minSize: 1,
      maxSize: 128
    };
    this.configure();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null);
  }

}

var Number = {
  code: types$1.Number.code,
  description: types$1.Number.description,
  class: types$1.Number.class,
  Info: NumberInfo,
  Builder: NumberBuilder,
  Form: NumberForm,
  Render: NumberRender
};

class CheckboxForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(Checkbox$1, {
      checked: this.state.value,
      onChange: (_ref) => {
        var {
          target
        } = _ref;
        return this.changeValue(target.checked);
      },
      style: {
        width: "100%"
      }
    }, this.state.options.placeholder));
  }

}

class CheckboxInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#85144b",
      style: {
        color: "white"
      }
    }, /*#__PURE__*/React.createElement(CheckSquareOutlined, null)));
  }

}

class CheckboxRender extends FieldifyTypeRender {}

class CheckboxBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.configure();
  }

}

var Checkbox = {
  code: types$1.Checkbox.code,
  description: types$1.Checkbox.description,
  class: types$1.Checkbox.class,
  Info: CheckboxInfo,
  Builder: CheckboxBuilder,
  Form: CheckboxForm,
  Render: CheckboxRender
};

class DateTimePickerForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(DatePicker$1, {
      showTime: true,
      defaultValue: this.state.value,
      onChange: date => {
        if (date) this.changeValue(date.format());else this.changeValue(null);
      }
    }));
  }

}

class DateTimePickerInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#fa541c"
    }, /*#__PURE__*/React.createElement(FieldTimeOutlined, null)));
  }

}

class DateTimePickerRender extends FieldifyTypeRender {}

class DateTimePickerBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.configure();
  }

}

var DateTimePicker = {
  code: types$1.DateTimePicker.code,
  description: types$1.DateTimePicker.description,
  class: types$1.DateTimePicker.class,
  Info: DateTimePickerInfo,
  Builder: DateTimePickerBuilder,
  Form: DateTimePickerForm,
  Render: DateTimePickerRender
};

class DatePickerForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(DatePicker$1, {
      defaultValue: this.state.value,
      onChange: (date, dateString) => this.changeValue(dateString)
    }));
  }

}

class DatePickerInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#ad2102"
    }, /*#__PURE__*/React.createElement(FieldTimeOutlined, null)));
  }

}

class DatePickerRender extends FieldifyTypeRender {}

class DatePickerBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.configure();
  }

}

var DatePicker = {
  code: types$1.DatePicker.code,
  description: types$1.DatePicker.description,
  class: types$1.DatePicker.class,
  Info: DatePickerInfo,
  Builder: DatePickerBuilder,
  Form: DatePickerForm,
  Render: DatePickerRender
};

var {
  RangePicker
} = DatePicker$1;

class DatePickerRangeForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(RangePicker, {
      onChange: (date, dateString) => {
        if (date) {
          var res = {
            from: dateString[0],
            to: dateString[1]
          };
          this.changeValue(res);
        } else {
          var _res = {
            from: null,
            to: null
          };
          this.changeValue(_res);
        }
      }
    }));
  }

}

class DatePickerRangeInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#ad2102"
    }, /*#__PURE__*/React.createElement(FieldTimeOutlined, null)));
  }

}

class DatePickerRangeRender extends FieldifyTypeRender {
  render() {
    return this.subRender( /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%"
      }
    }, typeof this.state.value === "object" && this.state.value.from && this.state.value.to ? this.state.value.from + " - " + this.state.value.to : "-"));
  }

}

class DatePickerRangeBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.configure();
  }

}

var DatePickerRange = {
  code: types$1.DatePickerRange.code,
  description: types$1.DatePickerRange.description,
  class: types$1.DatePickerRange.class,
  Info: DatePickerRangeInfo,
  Builder: DatePickerRangeBuilder,
  Form: DatePickerRangeForm,
  Render: DatePickerRangeRender
};

class TimePickerForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(TimePicker$1, {
      defaultValue: this.state.value,
      onChange: (date, dateString) => this.changeValue(dateString)
    }));
  }

}

class TimePickerInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#ad2102"
    }, /*#__PURE__*/React.createElement(FieldTimeOutlined, null)));
  }

}

class TimePickerRender extends FieldifyTypeRender {}

class TimePickerBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.configure();
  }

}

var TimePicker = {
  code: types$1.TimePicker.code,
  description: types$1.TimePicker.description,
  class: types$1.TimePicker.class,
  Info: TimePickerInfo,
  Builder: TimePickerBuilder,
  Form: TimePickerForm,
  Render: TimePickerRender
};

var {
  RangePicker: RangePicker$1
} = TimePicker$1;

class TimePickerRangeForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(RangePicker$1, {
      onChange: (date, dateString) => {
        if (date) {
          var res = {
            from: dateString[0],
            to: dateString[1]
          };
          this.changeValue(res);
        } else {
          var _res = {
            from: null,
            to: null
          };
          this.changeValue(_res);
        }
      }
    }));
  }

}

class TimePickerRangeInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#ad2102"
    }, /*#__PURE__*/React.createElement(FieldTimeOutlined, null)));
  }

}

class TimePickerRangeRender extends FieldifyTypeRender {
  render() {
    return this.subRender( /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%"
      }
    }, typeof this.state.value === "object" ? this.state.value.from + " - " + this.state.value.to : "-"));
  }

}

class TimePickerRangeBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.configure();
  }

}

var TimePickerRange = {
  code: types$1.TimePickerRange.code,
  description: types$1.TimePickerRange.description,
  class: types$1.TimePickerRange.class,
  Info: TimePickerRangeInfo,
  Builder: TimePickerRangeBuilder,
  Form: TimePickerRangeForm,
  Render: TimePickerRangeRender
};

class SelectForm extends FieldifyTypeForm {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      options: {}
    };
    if (props.schema.$options) this.state.options = props.schema.$options;

    if (!this.state.value && this.state.options.default) {
      this.state.value = this.state.options.default;
      this.onChange(this.schema, this.state.value);
    }

    this.state.items = this.updateItems();
  }

  updateItems() {
    if (!this.state.options.items) return [];
    var options = [];

    for (var key in this.state.options.items) {
      var value = this.state.options.items[key];
      options.push( /*#__PURE__*/React.createElement(Select$1.Option, {
        value: key,
        key: key
      }, value));
    }

    return options;
  }

  render() {
    return super.render( /*#__PURE__*/React.createElement(Select$1, {
      value: this.state.value,
      onChange: value => this.changeValue(value)
    }, this.state.items));
  }

}

class SelectInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#52c41a",
      style: {
        color: "white"
      }
    }, /*#__PURE__*/React.createElement(SelectOutlined, null)));
  }

}

class SelectRender extends FieldifyTypeRender {
  static getDerivedStateFromProps(props, state) {
    if (typeof state.value === "string") {
      if (props.schema.$options && props.schema.$options.items) {
        var ptr = props.schema.$options.items;
        if (ptr[state.value]) state.value = ptr[state.value];
      }
    }

    return state;
  }

}

class SelectBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.default = {
      minSize: 1,
      maxSize: 128
    };
    this.configure();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Item, {
      label: "Select min/max size"
    }, /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(InputNumber, {
      min: 0,
      value: this.state.minSize,
      onChange: value => this.changeIt("minSize", value)
    }), /*#__PURE__*/React.createElement(InputNumber, {
      min: 0,
      value: this.state.maxSize,
      onChange: value => this.changeIt("maxSize", value)
    }))));
  }

}

var Select = {
  code: types$1.Select.code,
  description: types$1.Select.description,
  class: types$1.Select.class,
  Info: SelectInfo,
  Builder: SelectBuilder,
  Form: SelectForm,
  Render: SelectRender
};

var _radioVertical = {
  display: 'block',
  height: '30px',
  lineHeight: '30px'
};

class RadioForm extends FieldifyTypeForm {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      options: {}
    };
    if (props.schema.$options) this.state.options = props.schema.$options;

    if (!this.state.value && this.state.options.default) {
      this.state.value = this.state.options.default;
      this.onChange(this.schema, this.state.value);
    }

    this.state.items = this.updateItems();
  }

  componentDidUpdate(props, state) {
    if (props.schema !== this.props.schema) {
      this.setState({
        options: props.schema.$options,
        items: this.updateItems()
      });
      this.onChange(this.schema, this.state.value);
    }
  }

  updateItems() {
    var style = _radioVertical;
    if (this.props.schema.$options.horizontal === true) style = null;
    if (!this.props.schema.$options.items) return [];
    var options = [];

    for (var key in this.props.schema.$options.items) {
      var value = this.props.schema.$options.items[key];
      options.push( /*#__PURE__*/React.createElement(Radio$1, {
        style: style,
        value: key,
        key: key
      }, value));
    }

    return options;
  }

  render() {
    return super.render( /*#__PURE__*/React.createElement(Radio$1.Group, {
      value: this.state.value,
      onChange: (_ref) => {
        var {
          target
        } = _ref;
        return this.changeValue(target.value);
      }
    }, this.state.items));
  }

}

class RadioInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#096dd9",
      style: {
        color: "white"
      }
    }, /*#__PURE__*/React.createElement(FieldBinaryOutlined, null)));
  }

}

class RadioRender extends FieldifyTypeRender {
  static getDerivedStateFromProps(props, state) {
    if (typeof state.value === "string") {
      if (props.schema.$options && props.schema.$options.items) {
        var ptr = props.schema.$options.items;
        if (ptr[state.value]) state.value = ptr[state.value];
      }
    }

    return state;
  }

}

class RadioBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.default = {
      minSize: 1,
      maxSize: 128
    };
    this.configure();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Item, {
      label: "Radio min/max size"
    }, /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(InputNumber, {
      min: 0,
      value: this.state.minSize,
      onChange: value => this.changeIt("minSize", value)
    }), /*#__PURE__*/React.createElement(InputNumber, {
      min: 0,
      value: this.state.maxSize,
      onChange: value => this.changeIt("maxSize", value)
    }))));
  }

}

var Radio = {
  code: types$1.Radio.code,
  description: types$1.Radio.description,
  class: types$1.Radio.class,
  Info: RadioInfo,
  Builder: RadioBuilder,
  Form: RadioForm,
  Render: RadioRender
};

class ObjectClass extends fieldifyType {}

var Object$1 = {
  code: "Object",
  description: "Nested Sub Object",
  class: ObjectClass
};

class ArrayClass extends fieldifyType {
  configuration() {
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
  }

}

var Array$1 = {
  code: "Array",
  description: "Array",
  class: ArrayClass
};

class FieldNameForm extends String.Form {
  constructor(props) {
    super(props);
  }

  verify(input, cb) {
    super.verify(input, ret => {
      if (ret.status !== "success") {
        return cb(ret);
      }

      if (this.props.user && input in this.props.user) {
        var msg = "Field name already used";
        this.onError(true, msg);
        return cb({
          status: "error",
          feedback: true,
          help: msg
        });
      }

      cb(ret);
    });
  }

}

class FieldNameInfo extends String.Info {}

class FieldNameBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.default = {
      minSize: 1,
      maxSize: 128
    };
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Item, {
      label: "FieldName min/max size"
    }));
  }

}

var FieldName = {
  code: types$1.FieldName.code,
  description: types$1.FieldName.description,
  class: types$1.FieldName.class,
  Info: FieldNameInfo,
  Builder: FieldNameBuilder,
  Form: FieldNameForm
};

class KVForm extends FieldifyTypeForm {
  constructor(props) {
    super(props);
  }

  cycle(props) {
    var ret = super.cycle(props);
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
  }

  computeDataSource(tree) {
    var _this = this;

    var ds = [];

    var _loop = function _loop(key) {
      var value = tree[key];
      ds.push({
        key: key,
        value: value,
        actions: /*#__PURE__*/React.createElement("div", {
          className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
        }, /*#__PURE__*/React.createElement("span", {
          className: "ant-radio-button-wrapper",
          onClick: () => _this.removeKey(key)
        }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null))), /*#__PURE__*/React.createElement("span", {
          className: "ant-radio-button-wrapper",
          onClick: () => _this.openModal({
            key,
            value
          })
        }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(EditOutlined, null))))
      });
    };

    for (var key in tree) {
      _loop(key);
    }

    return ds;
  }

  handleModalChange(key, value) {
    var modalCurrent = _extends({}, this.state.modalCurrent);

    modalCurrent[key] = value;
    this.setState({
      modalCurrent
    });
  }

  openModal(data) {
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
  }

  removeKey(key) {
    var state = _extends({}, this.state);

    delete state.dataTree[key];
    state.dataSource = this.computeDataSource(state.dataTree);
    this.setState(state);
    this.changeValue(state.dataTree);
  }

  editedButton() {
    var state = _extends({}, this.state);

    var mc = this.state.modalCurrent;
    var type = this.schema.$_type;
    var data = {};
    data[mc.key] = mc.value;
    type.verify(data, (error, message) => {
      state.modalError = error;
      state.modalErrorMessage = message;

      if (error === false) {
        if (state.modalInitial) {
          delete state.dataTree[state.modalInitial.key];
        }

        state.dataTree[state.modalCurrent.key] = state.modalCurrent.value;
        state.dataSource = this.computeDataSource(state.dataTree);
        state.modal = false;
      }

      this.setState(state);
      this.changeValue(state.dataTree);
    });
  }

  render() {
    var onCancel = () => {
      this.setState({
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
      title: /*#__PURE__*/React.createElement("div", {
        className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
      }, /*#__PURE__*/React.createElement("span", {
        className: "ant-radio-button-wrapper",
        onClick: () => this.openModal()
      }, /*#__PURE__*/React.createElement("span", null, "Add ", /*#__PURE__*/React.createElement(PlusOutlined, null)))),
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
    return super.render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Modal, {
      centered: true,
      closable: false,
      visible: this.state.modal,
      width: 300,
      onOk: this.editedButton.bind(this),
      onCancel: onCancel
    }, this.state.modalError === true ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement(Alert, {
      size: "small",
      message: this.state.modalErrorMessage,
      type: "error"
    })) : null, /*#__PURE__*/React.createElement(Form, layout, /*#__PURE__*/React.createElement(Form.Item, {
      label: "Key"
    }, /*#__PURE__*/React.createElement(Input$1, {
      value: this.state.modalCurrent.key,
      onChange: (_ref) => {
        var {
          target
        } = _ref;
        return this.handleModalChange("key", target.value);
      }
    })), /*#__PURE__*/React.createElement(Form.Item, {
      label: "Value"
    }, /*#__PURE__*/React.createElement(Input$1, {
      value: this.state.modalCurrent.value,
      onChange: (_ref2) => {
        var {
          target
        } = _ref2;
        return this.handleModalChange("value", target.value);
      }
    })))), /*#__PURE__*/React.createElement(Table, {
      size: "small",
      dataSource: this.state.dataSource,
      columns: columns,
      pagination: {
        total: this.state.dataSource.length,
        pageSize: this.state.dataSource.length,
        hideOnSinglePage: true
      }
    })));
  }

}

class KVInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#22075e"
    }, /*#__PURE__*/React.createElement(SmallDashOutlined, null)));
  }

}

class KVRender extends FieldifyTypeRender {
  cycle(props) {
    var ret = super.cycle(props);
    if (!ret.value) ret.value = {};
    this.result = _extends({}, ret.value);
    ret.dataTree = _extends({}, ret.value);
    ret.dataSource = this.computeDataSource(ret.dataTree);
    return ret;
  }

  computeDataSource(tree) {
    var ds = [];

    for (var key in tree) {
      var value = tree[key];
      ds.push({
        key: key,
        value: value
      });
    }

    return ds;
  }

  render() {
    var columns = [{
      dataIndex: 'key',
      key: 'key'
    }, {
      dataIndex: 'value',
      key: 'value'
    }];
    return super.subRender( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Table, {
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
  }

}

class KVBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.default = {
      minSize: 1,
      maxSize: 128
    };
    this.configure();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null);
  }

}

var KV = {
  code: types$1.KV.code,
  description: types$1.KV.description,
  class: types$1.KV.class,
  Info: KVInfo,
  Builder: KVBuilder,
  Form: KVForm,
  Render: KVRender
};

class HashForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(Input$1, {
      value: this.state.value,
      placeholder: this.state.options.placeholder,
      onChange: (_ref) => {
        var {
          target
        } = _ref;
        return this.changeValue(target.value);
      },
      style: {
        width: "100%"
      }
    }));
  }

}

class HashRender extends FieldifyTypeRender {}

class HashInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#badb64",
      style: {
        color: "#555555"
      }
    }, /*#__PURE__*/React.createElement(LinkOutlined, null)));
  }

}

class HashBuilder extends SignderivaTypeBuilder {
  constructor(props) {
    super(props);
    this.configure();
  }

}

var Hash = {
  code: types$1.Hash.code,
  description: types$1.Hash.description,
  class: types$1.Hash.class,
  Info: HashInfo,
  Builder: HashBuilder,
  Form: HashForm,
  Render: HashRender
};

var types = {
  Name,
  Email,
  String,
  Number,
  Select,
  Radio,
  Checkbox,
  DateTimePicker,
  DatePicker,
  DatePickerRange,
  TimePicker,
  TimePickerRange,
  Hash,
  Object: Object$1,
  Array: Array$1,
  FieldName,
  KV
};

class FieldifySchema extends schema$1 {
  constructor(name, options) {
    super(name, options);
  }

  resolver(type) {
    return types[type];
  }

  compile(schema) {
    super.compile(schema);
  }

}

class TypeDataset extends RecycledComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  cycle(props, first) {
    var state = {
      layout: props.layout ? props.layout : "horizontal"
    };
    state.rawSchema = props.schema;
    state.schema = new FieldifySchema("form");
    state.schema.compile(state.rawSchema);
    state.rawInput = props.input;
    state.input = new input(state.schema);
    state.input.setValue(props.input);
    state.inputValue = state.input.getValue();
    state.verify = props.verify || false;
    state.actions = props.actions;
    state.generator = props.generator;
    this.references = {};
    this.onChange = props.onChange ? props.onChange : () => {};
    state.reactive = this.update({
      state,
      root: state.schema,
      input: state.inputValue,
      verify: state.verify
    });
    return state;
  }

  getValue() {
    return this.state.input.getValue();
  }

  clickAddArray(line) {
    this.state.input.set(line);

    var _value = this.state.input.getValue();

    this.onChange(this.state.input, _value);
    this.setState({
      inputValue: _value,
      reactive: this.update({
        state: this.state,
        root: this.state.schema,
        input: _value,
        verify: false
      })
    });
  }

  clickRemoveArrayItem(line) {
    this.state.input.remove(line);

    var _value = this.state.input.getValue();

    this.onChange(this.state.input, _value);
    this.setState({
      inputValue: _value,
      reactive: this.update({
        state: this.state,
        root: this.state.schema,
        input: _value,
        verify: false
      })
    });
  }

  setValue(line, value) {
    if (!this.state.input) return;
    this.state.input.set(line, value);

    var _value = this.state.input.getValue();

    this.onChange(this.state.input, _value);
    this.setState({
      inputValue: _value
    });
  }

  update(up) {
    var _this = this;

    var {
      root,
      input,
      verify,
      state
    } = up;

    var follower = (schema, schematized, input, ret, line) => {
      line = line || "";
      if (!input) input = {};
      utils.orderedRead(schema, (index, item) => {
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
          }];

          if (state.actions === true) {
            columns.push({
              dataIndex: 'actions',
              key: 'actions',
              align: "right"
            });
          }

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
              var toPush = {
                key,
                form: child
              };

              if (state.actions === true) {
                toPush.actions = /*#__PURE__*/React.createElement(Button, {
                  size: "small",
                  onClick: () => _this.clickRemoveArrayItem(key)
                }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null)));
              }

              dataSource.push(toPush);
            };

            for (var a = 0; a < inputPtr2.length; a++) {
              _loop();
            }
          } else if (source.$type) {
            delete sourceSchematized.$doc;
            var TypeForm = source.$type[state.generator];

            if (!Array.isArray(inputPtr)) {
              input[source.$_key] = [];
              inputPtr2 = input[source.$_key];
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
              var toPush = {
                key,
                form: /*#__PURE__*/React.createElement(TypeForm, {
                  schema: sourceSchematized,
                  value: value,
                  verify: verify,
                  user: _this.props.user,
                  onChange: (schema, value) => _this.setValue(key, value),
                  isInjected: true,
                  onError: (error, message) => {
                    if (error === true) {
                      _this.references[key] = message;
                    } else {
                      var ref = _this.references[key];

                      if (ref) {
                        delete _this.references[key];
                      }
                    }
                  }
                })
              };

              if (state.actions === true) {
                toPush.actions = /*#__PURE__*/React.createElement(Button, {
                  size: "small",
                  onClick: () => _this.clickRemoveArrayItem(key)
                }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null)));
              }

              dataSource.push(toPush);
            };

            for (var a = 0; a < inputPtr2.length; a++) {
              _loop2();
            }
          }

          ret.push( /*#__PURE__*/React.createElement(Form.Item, {
            key: source.$_wire,
            noStyle: true
          }, /*#__PURE__*/React.createElement("div", {
            className: "ant-form-item"
          }, /*#__PURE__*/React.createElement(Card, {
            size: "small",
            title: source.$_access.$doc,
            extra: /*#__PURE__*/React.createElement("div", {
              className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
            }, inputPtr2 && state.actions === true ? /*#__PURE__*/React.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: () => this.clickAddArray(lineKey + "." + inputPtr2.length)
            }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(PlusOutlined, null))) : null)
          }, /*#__PURE__*/React.createElement(Table, {
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
            ret.push( /*#__PURE__*/React.createElement("div", {
              key: source.$_wire,
              className: "ant-form-item"
            }, /*#__PURE__*/React.createElement(Card, {
              size: "small",
              title: source.$doc
            }, child)));
          } else if (item.$type) {
            var _TypeForm = item.$type[state.generator];
            ret.push( /*#__PURE__*/React.createElement(_TypeForm, {
              schema: sourceSchematized,
              value: inputPtr,
              key: source.$_wire,
              verify: verify,
              user: this.props.user,
              onChange: (schema, value) => this.setValue(lineKey, value),
              onError: (error, message) => {
                if (error === true) {
                  this.references[source.$_wire] = message;
                } else {
                  var ref = this.references[source.$_wire];

                  if (ref) {
                    delete this.references[source.$_wire];
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
  }

  render() {
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

    return /*#__PURE__*/React.createElement(Form, _extends({
      layout: this.state.layout,
      key: this.formRef
    }, layout, {
      name: "basic"
    }), this.state.reactive);
  }

}

class FieldifySchemaForm extends RecycledComponent {
  cycle(props) {
    var state = {
      layout: props.layout,
      schema: props.schema,
      input: props.input,
      onChange: props.onChange
    };
    return state;
  }

  render() {
    return /*#__PURE__*/React.createElement(TypeDataset, {
      schema: this.state.schema,
      input: this.state.input,
      onChange: this.state.onChange,
      actions: true,
      layout: this.state.layout,
      generator: "Form"
    });
  }

}

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
class FieldifySchemaBuilderModal extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = this.cycle(props, true);
    this.currentSchema = baseSchema;
  }

  componentDidUpdate(props) {
    var changed = false;

    var state = _extends({}, this.state);

    if (this.props.visible !== props.visible) {
      this.currentSchema = baseSchema;
      state = this.cycle(this.props);
      changed = true;
    }

    if (changed === true) this.setState(state);
  }

  cycle(props, first) {
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
  }

  driveSchema(state, force) {
    var value = state.value;
    var Type = types[value.type];

    if (Type && Type !== this.currentType) {
      var TypeObject = new Type.class();
      var configuration = TypeObject.configuration();
      this.currentSchema = _extends({}, baseSchema);

      if (value.type === "Array") {
        this.currentSchema.content = {
          $doc: "Item content type",
          $type: "Select",
          $required: true,
          $options: {
            default: value.content || "Object",
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
      state.input = new input(state.schema);
    } else {
      state.schema = new FieldifySchema("modal");
      state.schema.compile(this.currentSchema);
      state.input = new input(state.schema);
    }
  }

  formChanged(value) {
    var state = {
      schema: this.state.schema,
      input: this.state.input,
      value: _extends({}, this.state.value, value)
    };
    this.driveSchema(state);
    state.input.setValue(state.value);
    this.setState(state);
    state.input.verify(result => {
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

      this.setState(state);
    });
  }

  handleOK() {
    this.state.input.verify(result => {
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
        this.setState(state);
        var value = result.result;
        var nvalue = {};

        for (var key in value) {
          nvalue['$' + key] = value[key];
        }

        var source = this.state.initialPath.split('.');
        source.pop();
        source.push(value.key);
        var npath = source.join('.');
        delete nvalue.$key;

        if (nvalue.$type === "Array" && nvalue.$content === "Object") {
          if (this.state.edition === true) {
            if (this.props.user.$_wire) {
              var no = utils.getNO(this.props.user);

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
              if (this.state.edition === true) {
                if (this.props.user.$_wire) {
                  var _no = utils.getNO(this.props.user);

                  for (var a in _no.nestedObject) {
                    var _p = _no.nestedObject[a];
                    nvalue[_p[0]] = _p[1];
                  }
                }
              } else if (!nvalue.$doc) nvalue.$doc = "";

              delete nvalue.$type;
            }

        if (this.state.edition === true) {
          this.props.onOk({
            edition: true,
            oldPath: this.state.initialPath,
            newPath: npath,
            key: value.key,
            value: nvalue
          });
        } else {
          this.props.onOk({
            edition: false,
            newPath: this.state.initialPath + "." + value.key,
            key: value.key,
            value: nvalue
          });
        }
      }
    });
  }

  render() {

    var onCancel = () => {
      this.props.onCancel(this.state);
    };
    return /*#__PURE__*/React.createElement(Modal, {
      title: /*#__PURE__*/React.createElement("span", null, "Add New Field To Your Schema ", /*#__PURE__*/React.createElement(Tag, {
        color: this.state.form.color
      }, this.state.form.state)),
      centered: true,
      visible: this.state.visible,
      width: 600,
      onOk: this.handleOK.bind(this),
      onCancel: onCancel
    }, /*#__PURE__*/React.createElement(FieldifySchemaForm, {
      ref: this.formRef,
      schema: this.currentSchema,
      input: this.state.value,
      user: this.props.user,
      verify: this.state.verify,
      onChange: this.formChanged.bind(this)
    }));
  }

}

class FieldifySchemaBuilder extends RecycledComponent {
  cycle(props, first) {
    var state = {
      modal: false,
      modalUser: null,
      schemaDataSource: []
    };

    this.onChange = () => {};

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
      title: /*#__PURE__*/React.createElement("div", {
        className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
      }, /*#__PURE__*/React.createElement("span", {
        className: "ant-radio-button-wrapper",
        onClick: () => this.handlingAdd()
      }, /*#__PURE__*/React.createElement("span", null, "Add ", /*#__PURE__*/React.createElement(PlusOutlined, null)))),
      dataIndex: 'actions',
      key: 'actions',
      align: "right"
    }];
    return state;
  }

  fireOnChange() {
    var ex = this.state.schema.export();
    this.onChange(ex);
  }

  itemChanged(arg) {
    if (arg.edition === true) {
      var lineup = this.state.schema.getLineup(arg.oldPath);
      this.state.schema.removeLineup(arg.oldPath);
      this.state.schema.setLineup(arg.newPath, arg.value);
      notification.success({
        message: "Field updated",
        description: "Field at " + arg.oldPath + " has been successfully updated"
      });
    } else {
        this.state.schema.setLineup(arg.newPath, arg.value);
        notification.success({
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
  }

  itemRemove(item) {
    this.state.schema.removeLineup(item.$_wire);
    this.fireOnChange();
    this.setState({
      schemaDataSource: this.updateDataSource(this.state.schema)
    });
    notification.success({
      message: "Field removed",
      description: "Field at " + item.$_wire + " has been successfully removed"
    });
  }

  handlingAdd(path) {
    path = path || ".";
    var lineup = this.state.schema.getLineup(path) || this.state.schema.handler.schema;
    var state = {
      modal: true,
      modalContent: null,
      modalUser: lineup
    };
    this.setState(state);
  }

  handlingEdit(item) {
    var path = item.$_wire || ".";
    var lineup = this.state.schema.getLineup(path) || this.state.schema.handler.schema;
    var state = {
      modal: true,
      modalContent: item,
      modalUser: lineup
    };
    this.setState(state);
  }

  updateDataSource(root) {
    var self = this;

    function fieldify2antDataTable(schema, wire) {
      if (!wire) wire = "";
      var current = [];
      utils.orderedRead(schema, (index, item) => {
        var path = wire + "." + item.$_key;
        item.$_path = path;

        if (Array.isArray(item)) {
          path = wire + "." + item[0].$_key;
          item[0].$_path = path;
          item[0].$_array = true;
          var composite = /*#__PURE__*/React.createElement(Tooltip, {
            title: "... of objects"
          }, /*#__PURE__*/React.createElement(Tag, {
            color: "#722ed1"
          }, /*#__PURE__*/React.createElement(UnorderedListOutlined, null)));

          if ("$type" in item[0]) {
            var TypeInfo = item[0].$type.Info;
            composite = /*#__PURE__*/React.createElement(TypeInfo, null);
          } else {
            item[0].$_nested = true;
          }

          current.push({
            ptr: item[0],
            key: path,
            name: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tooltip, {
              title: "This field is an array ..."
            }, /*#__PURE__*/React.createElement(Tag, {
              color: "#eb2f96"
            }, /*#__PURE__*/React.createElement(CopyOutlined, null))), composite, /*#__PURE__*/React.createElement("strong", null, item[0].$_key)),
            doc: item[0].$doc,
            children: !("$type" in item[0]) ? fieldify2antDataTable(item[0], path) : null,
            actions: /*#__PURE__*/React.createElement("div", {
              className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
            }, /*#__PURE__*/React.createElement(Popconfirm, {
              title: /*#__PURE__*/React.createElement("span", null, "Are you sure to delete the Array ", /*#__PURE__*/React.createElement("strong", null, path)),
              onConfirm: () => self.itemRemove(item[0]),
              okText: "Yes",
              cancelText: "No"
            }, /*#__PURE__*/React.createElement("span", {
              className: "ant-radio-button-wrapper"
            }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null)))), /*#__PURE__*/React.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: () => self.handlingEdit(item[0])
            }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(EditOutlined, null))), !("$type" in item[0]) ? /*#__PURE__*/React.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: () => self.handlingAdd(path)
            }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(PlusOutlined, null))) : null)
          });
        } else if (typeof item === "object" && !item.$type) {
            item.$_nested = true;
            current.push({
              ptr: item,
              key: path,
              name: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tooltip, {
                title: "This field is an object"
              }, /*#__PURE__*/React.createElement(Tag, {
                color: "#722ed1"
              }, /*#__PURE__*/React.createElement(UnorderedListOutlined, null))), /*#__PURE__*/React.createElement("strong", null, item.$_key)),
              doc: item.$doc,
              children: fieldify2antDataTable(item, path),
              actions: /*#__PURE__*/React.createElement("div", {
                className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
              }, /*#__PURE__*/React.createElement(Popconfirm, {
                title: /*#__PURE__*/React.createElement("span", null, "Are you sure to delete Object ", /*#__PURE__*/React.createElement("strong", null, path)),
                onConfirm: () => self.itemRemove(item),
                okText: "Yes",
                cancelText: "No"
              }, /*#__PURE__*/React.createElement("span", {
                className: "ant-radio-button-wrapper"
              }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null)))), /*#__PURE__*/React.createElement("span", {
                className: "ant-radio-button-wrapper",
                onClick: () => self.handlingEdit(item)
              }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(EditOutlined, null))), /*#__PURE__*/React.createElement("span", {
                className: "ant-radio-button-wrapper",
                onClick: () => self.handlingAdd(path)
              }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(PlusOutlined, null))))
            });
          } else {
            var _TypeInfo = item.$type.Info;
            current.push({
              ptr: item,
              key: path,
              name: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_TypeInfo, null), " ", item.$_key),
              doc: item.$doc,
              actions: /*#__PURE__*/React.createElement("div", {
                className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
              }, /*#__PURE__*/React.createElement(Popconfirm, {
                title: /*#__PURE__*/React.createElement("span", null, "Are you sure to delete ", /*#__PURE__*/React.createElement("strong", null, path)),
                onConfirm: () => self.itemRemove(item),
                okText: "Yes",
                cancelText: "No"
              }, /*#__PURE__*/React.createElement("span", {
                className: "ant-radio-button-wrapper"
              }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null)))), /*#__PURE__*/React.createElement("span", {
                className: "ant-radio-button-wrapper",
                onClick: () => self.handlingEdit(item)
              }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(EditOutlined, null))))
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
  }

  render() {
    var sds = this.state.schemaDataSource;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FieldifySchemaBuilderModal, {
      user: this.state.modalUser,
      visible: this.state.modal,
      value: this.state.modalContent,
      onCancel: () => this.setState({
        modal: false
      }),
      onOk: this.itemChanged.bind(this)
    }), /*#__PURE__*/React.createElement(Table, {
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
  }

}

class FieldifySchemaRender extends RecycledComponent {
  cycle(props) {
    var state = {
      layout: props.layout,
      schema: props.schema,
      input: props.input
    };
    return state;
  }

  render() {
    return /*#__PURE__*/React.createElement(TypeDataset, {
      schema: this.state.schema,
      input: this.state.input,
      actions: false,
      layout: this.state.layout,
      generator: "Render"
    });
  }

}



var schema = {
  __proto__: null,
  FieldifySchemaBuilder: FieldifySchemaBuilder,
  FieldifySchemaForm: FieldifySchemaForm,
  FieldifySchemaRender: FieldifySchemaRender,
  FieldifySchema: FieldifySchema
};

var name = "@fieldify/antd";
var version = "1.0.8";
var description = "Rendering Fieldify&#x27; Types Using Ant Design Framework";
var author = "";
var license = "GPL-3.0";
var repository = "https://github.com/Fieldify/ant-design";
var main = "dist/index.js";
var source = "src/index.js";
var engines = {
	node: ">=10"
};
var scripts = {
	build: "microbundle-crl build --no-compress",
	start: "microbundle-crl watch --no-compress",
	prepublish: "run-s build",
	test: "run-s test:unit test:lint test:build",
	"test:build": "run-s build",
	"test:lint": "eslint .",
	"test:unit": "cross-env CI=1 react-scripts test --env=jsdom",
	"test:watch": "react-scripts test --env=jsdom",
	predeploy: "cd example && yarn install && yarn run build",
	deploy: "gh-pages -d example/build",
	docs: "cd example; yarn build; rm -rf ../docs; cp -a ./build ../docs"
};
var peerDependencies = {
	"@ant-design/icons": "^4.1.0",
	antd: "^4.2.4",
	react: "^16.13.1",
	"react-dom": "^16.13.1",
	"react-recycling": "^1.0.2",
	"react-scripts": "^3.4.1"
};
var devDependencies = {
	"@ant-design/icons": "^4.1.0",
	antd: "^4.4.1",
	"babel-core": "^6.26.3",
	"babel-eslint": "^10.0.3",
	"babel-plugin-external-helpers": "^6.22.0",
	"babel-preset-env": "^1.7.0",
	"babel-preset-react": "^6.24.1",
	"babel-preset-stage-0": "^6.24.1",
	"cross-env": "^7.0.2",
	eslint: "^6.8.0",
	"eslint-config-prettier": "^6.7.0",
	"eslint-config-standard": "^14.1.0",
	"eslint-config-standard-react": "^9.2.0",
	"eslint-plugin-import": "^2.22.0",
	"eslint-plugin-node": "^11.0.0",
	"eslint-plugin-prettier": "^3.1.4",
	"eslint-plugin-promise": "^4.2.1",
	"eslint-plugin-react": "^7.20.3",
	"eslint-plugin-standard": "^4.0.1",
	"gh-pages": "^2.2.0",
	"microbundle-crl": "^0.13.11",
	"npm-run-all": "^4.1.5",
	prettier: "^2.0.4",
	react: "^16.13.1",
	"react-dom": "^16.13.1",
	"react-recycling": "^1.0.3",
	"react-scripts": "^3.4.1"
};
var files = [
	"dist"
];
var dependencies = {
	fieldify: "^1.1.2"
};
var pack = {
	name: name,
	version: version,
	description: description,
	author: author,
	license: license,
	repository: repository,
	main: main,
	source: source,
	engines: engines,
	scripts: scripts,
	peerDependencies: peerDependencies,
	devDependencies: devDependencies,
	files: files,
	dependencies: dependencies
};

class Input extends input {}
var Schema = schema;
var Types = types;
var Version = pack.version;

export { Input, Schema, Types, Version };
//# sourceMappingURL=index.esm.js.map
