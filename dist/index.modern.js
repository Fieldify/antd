import { types as types$1, fieldifyType, schema as schema$1, input, utils } from 'fieldify';
import React, { Component } from 'react';
import { Form, Input as Input$1, Tag, Space, InputNumber, Row, Col, Checkbox as Checkbox$1, Select as Select$1, Modal, Alert, Table, Card, Button, notification, Tooltip, Popconfirm } from 'antd';
import { FieldStringOutlined, UserSwitchOutlined, MailOutlined, NumberOutlined, SelectOutlined, SmallDashOutlined, DeleteOutlined, EditOutlined, PlusOutlined, CopyOutlined, UnorderedListOutlined } from '@ant-design/icons';

class RecycledComponent extends React.Component {
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = this.cycle(props, true);
  }

  componentDidUpdate(props, state) {
    if (super.componentDidUpdate) super.componentDidUpdate(props, state);
    var changed = false;

    for (var a in props) {
      if (typeof props[a] !== "function" && props[a] !== this.props[a]) {
        changed = true;
        break;
      }
    }

    if (changed === true) {
      this.setState(this.cycle(this.props, false));
    }
  }

  cycle(props, first) {
    return {};
  }

}

class FieldifyTypeForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.cycle(props);
  }

  componentDidUpdate(props, state) {
    if (this.props.schema !== props.schema) {
      const cycle = this.cycle(this.props);
      this.setState(cycle);
    }
  }

  cycle(props) {
    this.schema = props.schema;
    const state = {
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
    const state = {
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
    this.state = { ...props.options
    };
    this.default = {};
  }

  componentDidUpdate(prevProps, prevState) {
    const pNew = this.props.options || {};
    const pOld = prevProps.options || {};
    var changed = 0;

    for (var key in this.default) {
      const o = pOld[key];
      const n = pNew[key];
      if (o !== n) changed++;
    }

    if (changed > 0) {
      this.setState(pNew);
      this.onChange({ ...pNew
      });
    }
  }

  setup(prev) {
    const state = { ...prev
    };

    for (var a in state) {
      const p = this.default[a];
      if (!p) delete state[a];
    }

    for (var a in this.default) {
      if (!(a in state)) state[a] = this.default[a];
    }

    return state;
  }

  configure() {
    this.state = this.setup(this.state);
    this.onChange({ ...this.state
    });
  }

  changeIt(key, value) {
    const change = Object.assign({}, this.state);
    change[key] = value;
    this.setState(change);
    this.onChange({ ...change
    });
  }

}

class StringForm extends FieldifyTypeForm {
  render() {
    return super.render( /*#__PURE__*/React.createElement(Input$1, {
      value: this.state.value,
      placeholder: this.state.options.placeholder,
      onChange: ({
        target
      }) => this.changeValue(target.value),
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

const StringForm$1 = String.Form;

class NameForm extends FieldifyTypeForm {
  constructor(props) {
    super(props);
  }

  cycle(props) {
    const ret = super.cycle(props);
    if (!ret.value) ret.value = {};
    this.result = { ...ret.value
    };
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
      onChange: ({
        target
      }) => this.changeValue(target.value)
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
      onChange: ({
        target
      }) => this.changeIt("subAddressing", target.checked)
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
    return super.render( /*#__PURE__*/React.createElement(Input$1, {
      placeholder: "Checkbox of characters"
    }));
  }

}

class CheckboxInfo extends SignderivaTypeInfo {
  render() {
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Tag, {
      color: "#fadb14",
      style: {
        color: "#555555"
      }
    }, /*#__PURE__*/React.createElement(FieldStringOutlined, null)));
  }

}

class CheckboxBuilder extends SignderivaTypeBuilder {
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
      label: "Checkbox min/max size"
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

var Checkbox = {
  code: types$1.Checkbox.code,
  description: types$1.Checkbox.description,
  class: types$1.Checkbox.class,
  Info: CheckboxInfo,
  Builder: CheckboxBuilder,
  Form: CheckboxForm
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
    const options = [];

    for (var key in this.state.options.items) {
      const value = this.state.options.items[key];
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
        const ptr = props.schema.$options.items;
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
        const msg = `Field name already used`;
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
    const ret = super.cycle(props);
    if (!ret.value) ret.value = {};
    this.result = { ...ret.value
    };
    ret.modal = false;
    ret.modalCurrent = {
      key: "",
      value: ""
    };
    ret.dataTree = { ...ret.value
    };
    ret.dataSource = this.computeDataSource(ret.dataTree);
    return ret;
  }

  computeDataSource(tree) {
    const ds = [];

    for (let key in tree) {
      const value = tree[key];
      ds.push({
        key: key,
        value: value,
        actions: /*#__PURE__*/React.createElement("div", {
          className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
        }, /*#__PURE__*/React.createElement("span", {
          className: "ant-radio-button-wrapper",
          onClick: () => this.removeKey(key)
        }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null))), /*#__PURE__*/React.createElement("span", {
          className: "ant-radio-button-wrapper",
          onClick: () => this.openModal({
            key,
            value
          })
        }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(EditOutlined, null))))
      });
    }

    return ds;
  }

  handleModalChange(key, value) {
    const modalCurrent = { ...this.state.modalCurrent
    };
    modalCurrent[key] = value;
    this.setState({
      modalCurrent
    });
  }

  openModal(data) {
    const state = {
      modalError: false,
      modalInitial: null,
      modalCurrent: data || {
        key: "",
        value: ""
      },
      modal: true
    };
    if (data) state.modalInitial = { ...state.modalCurrent
    };
    this.setState(state);
  }

  removeKey(key) {
    const state = { ...this.state
    };
    delete state.dataTree[key];
    state.dataSource = this.computeDataSource(state.dataTree);
    this.setState(state);
    this.changeValue(state.dataTree);
  }

  editedButton() {
    const state = { ...this.state
    };
    const mc = this.state.modalCurrent;
    const type = this.schema.$_type;
    const data = {};
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
    const onCancel = () => {
      this.setState({
        modal: false
      });
    };

    const columns = [{
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
    const layout = {
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
      onChange: ({
        target
      }) => this.handleModalChange("key", target.value)
    })), /*#__PURE__*/React.createElement(Form.Item, {
      label: "Value"
    }, /*#__PURE__*/React.createElement(Input$1, {
      value: this.state.modalCurrent.value,
      onChange: ({
        target
      }) => this.handleModalChange("value", target.value)
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
    const ret = super.cycle(props);
    if (!ret.value) ret.value = {};
    this.result = { ...ret.value
    };
    ret.dataTree = { ...ret.value
    };
    ret.dataSource = this.computeDataSource(ret.dataTree);
    return ret;
  }

  computeDataSource(tree) {
    const ds = [];

    for (let key in tree) {
      const value = tree[key];
      ds.push({
        key: key,
        value: value
      });
    }

    return ds;
  }

  render() {
    const columns = [{
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

var types = {
  Name,
  Email,
  String,
  Number,
  Select,
  Checkbox,
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

class FieldifySchemaForm extends RecycledComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  cycle(props, first) {
    const state = {};
    this.schema = props.schema;
    this.input = props.input;

    if (!this.input || !(typeof props.input === "object")) {
      this.input = new input(this.schema);
    }

    state.input = this.input.getValue();
    state.verify = props.verify || false;
    state.reactive = this.update(state.input, state.verify);
    this.references = {};
    this.onChange = props.onChange ? props.onChange : () => {};
    return state;
  }

  clickAddArray(line) {
    this.input.set(line);

    const _value = this.input.getValue();

    this.onChange(_value);
    this.setState({
      input: _value,
      reactive: this.update(_value, false)
    });
  }

  clickRemoveArrayItem(line) {
    this.input.remove(line);

    const _value = this.input.getValue();

    this.onChange(_value);
    this.setState({
      input: _value,
      reactive: this.update(_value, false)
    });
  }

  setValue(line, value) {
    this.input.set(line, value);

    const _value = this.input.getValue();

    this.onChange(_value);
    this.setState({
      input: _value
    });
  }

  input(input, verify) {}

  update(input, verify) {
    const follower = (schema, input, ret, line) => {
      line = line || "";
      utils.orderedRead(schema, (index, item) => {
        const source = { ...(Array.isArray(item) ? item[0] : item)
        };
        const inputPtr = input ? input[source.$_key] : null;
        const lineKey = line + "." + source.$_key;

        if (source.$_array === true) {
          const columns = [{
            dataIndex: 'form',
            key: 'form',
            width: "100%"
          }, {
            dataIndex: 'actions',
            key: 'actions',
            align: "right"
          }];
          const dataSource = [];
          var inputPtr2 = inputPtr;
          const options = source.$array || {};
          const min = options.min ? options.min : source.$required === true ? 1 : 0;

          if (source.$_nested === true) {
            var inputPtr2 = input[source.$_key];
            if (!Array.isArray(inputPtr)) inputPtr2 = input[source.$_key] = [];

            if (min - inputPtr2.length > 0) {
              for (var a = 0; a <= min - inputPtr2.length; a++) {
                inputPtr2.push({});
              }
            }

            for (var a = 0; a < inputPtr2.length; a++) {
              const value = inputPtr2[a];
              const key = lineKey + "." + a;
              const child = [];
              follower(source, value, child, key);
              dataSource.push({
                key,
                form: child,
                actions: /*#__PURE__*/React.createElement(Button, {
                  size: "small",
                  onClick: () => this.clickRemoveArrayItem(key)
                }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null)))
              });
            }
          } else {
            delete source.$doc;
            const TypeForm = source.$type.Form;

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
              const value = inputPtr2[a];
              const key = lineKey + "." + a;
              dataSource.push({
                key,
                form: /*#__PURE__*/React.createElement(TypeForm, {
                  schema: source,
                  value: value,
                  verify: verify,
                  user: this.props.user,
                  onChange: (schema, value) => this.setValue(key, value),
                  isInjected: true,
                  onError: (error, message) => {
                    if (error === true) {
                      this.references[key] = message;
                    } else {
                      const ref = this.references[key];

                      if (ref) {
                        delete this.references[key];
                      }
                    }
                  }
                }),
                actions: /*#__PURE__*/React.createElement(Button, {
                  size: "small",
                  onClick: () => this.clickRemoveArrayItem(key)
                }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null)))
              });
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
            }, /*#__PURE__*/React.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: () => this.clickAddArray(lineKey + "." + inputPtr2.length)
            }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(PlusOutlined, null))))
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
            const child = [];
            follower(source, inputPtr, child, lineKey);
            ret.push( /*#__PURE__*/React.createElement("div", {
              key: source.$_wire,
              className: "ant-form-item"
            }, /*#__PURE__*/React.createElement(Card, {
              size: "small",
              title: source.$doc
            }, child)));
          } else {
            const TypeForm = item.$type.Form;
            ret.push( /*#__PURE__*/React.createElement(TypeForm, {
              schema: source,
              value: inputPtr,
              key: source.$_wire,
              verify: verify,
              user: this.props.user,
              onChange: (schema, value) => this.setValue(lineKey, value),
              onError: (error, message) => {
                if (error === true) {
                  this.references[source.$_wire] = message;
                } else {
                  const ref = this.references[source.$_wire];

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

    const ret = [];
    follower(this.schema.handler.schema, input, ret);
    return ret;
  }

  render() {
    const layout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    };
    return /*#__PURE__*/React.createElement(Form, Object.assign({
      key: this.formRef
    }, layout, {
      name: "basic"
    }), this.state.reactive);
  }

}

const allTypes = {};
const allTypesNoArray = {};

for (var a in types) {
  allTypes[a] = types[a].description;

  if (a !== "Array") {
    allTypesNoArray[a] = types[a].description;
  }
}

const baseSchema = {
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
    var state = { ...this.state
    };

    if (this.props.visible !== props.visible) {
      this.currentSchema = baseSchema;
      state = this.cycle(this.props);
      changed = true;
    }

    if (changed === true) this.setState(state);
  }

  cycle(props, first) {
    const state = {
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
      const val = props.value;
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
    const value = state.value;
    const Type = types[value.type];

    if (Type && Type !== this.currentType) {
      const TypeObject = new Type.class();
      const configuration = TypeObject.configuration();
      this.currentSchema = { ...baseSchema
      };

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

      if (configuration) this.currentSchema.options = { ...configuration,
        $doc: "Type configuration"
      };
      state.currentType = Type;
      state.schema = new FieldifySchema("modal");
      state.schema.compile(this.currentSchema);
      state.input = new input(state.schema);
    } else if (!state.schema || force === true) {
      state.schema = new FieldifySchema("modal");
      state.schema.compile(this.currentSchema);
      state.input = new input(state.schema);
    }
  }

  formChanged(value) {
    const state = {
      schema: this.state.schema,
      input: this.state.input,
      value: { ...this.state.value,
        ...value
      }
    };
    this.driveSchema(state);
    state.input.setValue(state.value);
    this.setState(state);
    state.input.verify(result => {
      const state = {
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
      const state = {
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
        const value = this.state.input.getValue();
        var nvalue = {};

        for (var key in value) nvalue['$' + key] = value[key];

        const source = this.state.initialPath.split('.');
        source.pop();
        source.push(value.key);
        const npath = source.join('.');
        delete nvalue.$key;

        if (nvalue.$type === "Array" && nvalue.$content === "Object") {
          delete nvalue.$type;
          delete nvalue.$content;
          nvalue = [nvalue];
        } else if (nvalue.$type === "Array" && nvalue.$content !== "Object") {
            nvalue.$type = nvalue.$content;
            delete nvalue.$content;
            nvalue = [nvalue];
          } else if (nvalue.$type === "Object") {
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

    const onCancel = () => {
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
      schema: this.state.schema,
      input: this.state.input,
      user: this.props.user,
      verify: this.state.verify,
      onChange: this.formChanged.bind(this)
    }));
  }

}

class FieldifySchemaBuilder extends RecycledComponent {
  cycle(props, first) {
    const state = {
      modal: false,
      modalUser: null,
      schemaDataSource: []
    };

    this.onChange = () => {};

    if (props.onChange) this.onChange = props.onChange;
    this.schema = props.schema;
    state.schemaDataSource = this.updateDataSource();
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
    const ex = this.schema.export();
    this.schema.compile(ex);
    this.onChange(ex);
  }

  itemChanged(arg) {
    if (arg.edition === true) {
      const lineup = this.props.schema.getLineup(arg.oldPath);
      this.props.schema.removeLineup(arg.oldPath);
      this.props.schema.setLineup(arg.newPath, arg.value);
      notification.success({
        message: "Field updated",
        description: `Field at ${arg.oldPath} has been successfully updated`
      });
    } else {
        this.props.schema.setLineup(arg.newPath, arg.value);
        notification.success({
          message: "Field added",
          description: `Field at ${arg.newPath} has been successfully added`
        });
      }

    this.fireOnChange();
    this.setState({
      modal: false,
      modalContent: null,
      modalUser: null,
      schemaDataSource: this.updateDataSource()
    });
  }

  itemRemove(item) {
    this.props.schema.removeLineup(item.$_wire);
    this.fireOnChange();
    this.setState({
      schemaDataSource: this.updateDataSource()
    });
    notification.success({
      message: "Field removed",
      description: `Field at ${item.$_wire} has been successfully removed`
    });
  }

  handlingAdd(path) {
    path = path || ".";
    const lineup = this.props.schema.getLineup(path) || this.schema.handler.schema;
    const state = {
      modal: true,
      modalContent: null,
      modalUser: lineup
    };
    this.setState(state);
  }

  handlingEdit(item) {
    const path = item.$_wire || ".";
    const lineup = this.props.schema.getLineup(path) || this.schema.handler.schema;
    const state = {
      modal: true,
      modalContent: item,
      modalUser: lineup
    };
    this.setState(state);
  }

  updateDataSource() {
    const self = this;

    function fieldify2antDataTable(schema, wire) {
      if (!wire) wire = "";
      const current = [];
      utils.orderedRead(schema, (index, item) => {
        const source = { ...(Array.isArray(item) ? item[0] : item)
        };
        var path = wire + "." + item.$_key;
        item.$_path = path;

        if (source.$_array === true) {
          path = wire + "." + item[0].$_key;
          item[0].$_path = path;
          var composite = /*#__PURE__*/React.createElement(Tooltip, {
            title: "... of objects"
          }, /*#__PURE__*/React.createElement(Tag, {
            color: "#722ed1"
          }, /*#__PURE__*/React.createElement(UnorderedListOutlined, null)));

          if ("$type" in item[0]) {
            const TypeInfo = item[0].$type.Info;
            composite = /*#__PURE__*/React.createElement(TypeInfo, null);
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
        } else if (source.$_array !== true && source.$_nested === true) {
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
          } else if (source.$_array !== true && source.$_nested !== true) {
            const TypeInfo = item.$type.Info;
            current.push({
              ptr: item,
              key: path,
              name: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TypeInfo, null), " ", item.$_key),
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

    if (this.schema) {
      data = fieldify2antDataTable(this.schema.handler.schema);
      return data;
    }

    return [];
  }

  render() {
    const sds = this.state.schemaDataSource;
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
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  cycle(props, first) {
    const state = {
      input: props.input,
      layout: props.layout ? props.layout : "horizontal"
    };
    this.schema = props.schema;
    state.verify = props.verify || false;
    state.reactive = this.update(state.input, state.verify);
    this.references = {};
    this.onChange = props.onChange ? props.onChange : () => {};
    return state;
  }

  update(input, verify) {
    const follower = (schema, input, ret, line) => {
      line = line || "";
      utils.orderedRead(schema, (index, item) => {
        const source = { ...(Array.isArray(item) ? item[0] : item)
        };
        const inputPtr = input ? input[source.$_key] : null;
        const lineKey = line + "." + source.$_key;

        if (source.$_array === true) {
          const columns = [{
            dataIndex: 'form',
            key: 'form',
            width: "100%"
          }];
          const dataSource = [];
          var inputPtr2 = inputPtr;
          const options = source.$array || {};
          const min = options.min ? options.min : source.$required === true ? 1 : 0;

          if (source.$_nested === true) {
            var inputPtr2 = input[source.$_key];
            if (!Array.isArray(inputPtr)) inputPtr2 = input[source.$_key] = [];

            if (min - inputPtr2.length > 0) {
              for (var a = 0; a <= min - inputPtr2.length; a++) {
                inputPtr2.push({});
              }
            }

            for (var a = 0; a < inputPtr2.length; a++) {
              const value = inputPtr2[a];
              const key = lineKey + "." + a;
              const child = [];
              follower(source, value, child, key);
              dataSource.push({
                key,
                form: child
              });
            }
          } else {
            delete source.$doc;
            const TypeRender = source.$type.Render;

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
                const value = inputPtr2[a];
                const key = lineKey + "." + a;
                dataSource.push({
                  key,
                  form: /*#__PURE__*/React.createElement(TypeRender, {
                    schema: source,
                    value: value,
                    injected: true,
                    key: "render." + source.$_wire
                  })
                });
              }
            }
          }

          ret.push( /*#__PURE__*/React.createElement(Form.Item, {
            key: source.$_wire,
            noStyle: true
          }, /*#__PURE__*/React.createElement("div", {
            className: "ant-form-item"
          }, /*#__PURE__*/React.createElement(Card, {
            size: "small",
            title: source.$_access.$doc
          }, /*#__PURE__*/React.createElement(Table, {
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
            const child = [];
            follower(source, inputPtr, child, lineKey);
            ret.push( /*#__PURE__*/React.createElement("div", {
              key: "render." + source.$_wire,
              className: "ant-form-item"
            }, /*#__PURE__*/React.createElement(Card, {
              size: "small",
              title: source.$doc
            }, child)));
          } else {
            const TypeRender = item.$type.Render;

            if (TypeRender) {
              ret.push( /*#__PURE__*/React.createElement(TypeRender, {
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

    const ret = [];
    follower(this.schema.handler.schema, input, ret);
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

    return /*#__PURE__*/React.createElement(Form, Object.assign({
      layout: this.state.layout,
      key: this.formRef
    }, layout, {
      name: "basic"
    }), this.state.reactive);
  }

}



var schema = {
  __proto__: null,
  FieldifySchemaBuilder: FieldifySchemaBuilder,
  FieldifySchemaForm: FieldifySchemaForm,
  FieldifySchemaRender: FieldifySchemaRender,
  FieldifySchema: FieldifySchema
};

class Input extends input {}
const Schema = schema;
const Types = types;

export { Input, Schema, Types };
//# sourceMappingURL=index.modern.js.map
