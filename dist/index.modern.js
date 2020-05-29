import { types as types$1, schema as schema$1, input, utils } from 'fieldify';
import React, { Component } from 'react';
import { Form, Input as Input$1, Tag, Space, InputNumber, Row, Col, Checkbox as Checkbox$1, Select as Select$1, Card, Table, Button, Modal, notification, Tooltip, Popconfirm } from 'antd';
import { FieldStringOutlined, UserSwitchOutlined, MailOutlined, PlusOutlined, DeleteOutlined, CopyOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';

class FieldifyTypeForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.cycle(props);

    if (props.verify === true) {
      this.verify(props.value, ret => {
        this.state = { ...this.state,
          ...ret
        };
      });
    }
  }

  componentDidUpdate(props, state) {
    if (this.props !== props) {
      const cycle = this.cycle(this.props);
      this.setState(cycle);
    }
  }

  cycle(props) {
    this.schema = props.schema;
    const state = {
      value: props.value
    };
    this.isInjected = props.isInjected;
    this.onChange = props.onChange ? props.onChange : () => {};
    this.onError = props.onError ? props.onError : () => {};
    if (!this.schema) return state;
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
    speed = speed || 500;
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
    if (!this.schema || this.isInjected === true) return /*#__PURE__*/React.createElement(Form.Item, {
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
  Form: StringForm
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
  Form: EmailForm
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
      color: "#fadb14",
      style: {
        color: "#555555"
      }
    }, /*#__PURE__*/React.createElement(FieldStringOutlined, null)));
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
  Form: SelectForm
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

var types = {
  Name,
  Email,
  String,
  Select,
  Checkbox,
  FieldName
};

class FieldifySchema extends schema$1 {
  constructor(name, options) {
    super(name, options);
  }

  compile(schema) {
    super.compile(schema);
  }

}

class FieldifySchemaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.cycle(props, true);
  }

  componentDidUpdate(props, state) {
    if (this.props !== props) {
      const cycle = this.cycle(this.props);
      this.setState(cycle);
    }
  }

  cycle(props, first) {
    this.schema = props.schema;
    this.input = props.input;

    if (!this.input || !(typeof props.input === "object")) {
      this.input = new input(this.schema);
    }

    const state = {
      input: this.input.getValue()
    };
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
        const inputPtr = input ? input[item.$_key] : null;
        const lineKey = line + "." + item.$_key;
        if (item.hidden === true) return;

        if (Array.isArray(item)) {
          const source = { ...item[0]
          };
          var inputPtr2 = inputPtr;
          const options = source.$array || {};
          const min = options.min ? options.min : source.$required === true ? 1 : 0;
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

          if (source.$_array === true && source.$_nested !== true) {
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
                const TypeForm = source.$type.Form;

                for (var a = 0; a < inputPtr2.length; a++) {
                  const value = inputPtr2[a];
                  const key = lineKey + "." + a;
                  dataSource.push({
                    key,
                    form: /*#__PURE__*/React.createElement(TypeForm, {
                      schema: source,
                      value: value,
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
              } else {
                for (var a = 0; a < inputPtr2.length; a++) {
                  const value = inputPtr2[a];
                  const key = lineKey + "." + a;
                  const child = [];
                  follower(item.$_ptr[0], value, child, key);
                  dataSource.push({
                    key,
                    form: child,
                    actions: /*#__PURE__*/React.createElement(Button, {
                      size: "small",
                      onClick: () => this.clickRemoveArrayItem(key)
                    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null)))
                  });
                }
              }
            }

          ret.push( /*#__PURE__*/React.createElement(Form.Item, {
            key: item.$_wire,
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
        } else if (typeof item === "object" && !item.$type) {
            const child = [];
            follower(item.$_ptr, inputPtr, child, lineKey);
            ret.push( /*#__PURE__*/React.createElement("div", {
              key: item.$_wire,
              className: "ant-form-item"
            }, /*#__PURE__*/React.createElement(Card, {
              size: "small",
              title: item.$doc
            }, child)));
          } else {
              const TypeForm = item.$type.Form;
              ret.push( /*#__PURE__*/React.createElement(TypeForm, {
                schema: item,
                value: inputPtr,
                key: item.$_wire,
                user: this.props.user,
                onChange: (schema, value) => this.setValue(lineKey, value),
                onError: (error, message) => {
                  if (error === true) {
                    this.references[item.$_key] = message;
                  } else {
                    const ref = this.references[item.$_key];

                    if (ref) {
                      delete this.references[item.$_key];
                    }
                  }
                }
              }));
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
    return /*#__PURE__*/React.createElement(Form, Object.assign({}, layout, {
      name: "basic"
    }), this.state.reactive);
  }

}

class FieldifySchemaBuilderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      user: props.user,
      size: 1
    };
    this.allTypes = {};

    for (var a in types) {
      this.allTypes[a] = types[a].description;
    }

    this.schema = new FieldifySchema("modal");
    this.schema.compile({
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
          items: this.allTypes
        }
      },
      doc: {
        $doc: "Description",
        $required: true,
        $type: types.String
      }
    });
    this.formRef = React.createRef();
  }

  componentDidUpdate(props, state) {
    const newState = { ...this.state
    };
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
  }

  receiveHeadForm() {
    console.log("receiveHeadForm");
  }

  render() {
    const onOk = () => {};

    const onCancel = () => {
      this.props.onCancel(this.state);
    };
    return /*#__PURE__*/React.createElement(Modal, {
      title: "Add New Field To Your Schema",
      width: this.state.size * 520,
      centered: true,
      visible: this.state.visible,
      onOk: onOk,
      onCancel: onCancel
    }, /*#__PURE__*/React.createElement(FieldifySchemaForm, {
      ref: this.formRef,
      schema: this.schema,
      user: this.props.user,
      onChange: this.receiveHeadForm.bind(this)
    }));
  }

}

class FieldifySchemaBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalUser: null,
      schemaDataSource: []
    };
    this.schema = props.schema;
    this.state.schemaDataSource = this.updateDataSource();
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
      }, /*#__PURE__*/React.createElement("span", null, "Add Field ", /*#__PURE__*/React.createElement(PlusOutlined, null)))),
      dataIndex: 'actions',
      key: 'actions',
      align: "right"
    }];
  }

  fireOnChange() {}

  itemChanged(arg) {
    console.log("itemChanged", arg);
  }

  itemRemove(item) {
    this.props.schema.removeLineup(item.$_path);
    this.fireOnChange();
    this.setState({
      schemaDataSource: this.updateDataSource()
    });
    notification.success({
      message: "Field removed",
      description: `Field at ${item.$_path} has been removed successfully`
    });
  }

  handlingAdd(path) {
    path = path || ".";
    const lineup = this.props.schema.getLineup(path) || this.schema.handler.schema;
    console.log("handing add", path, lineup);
    this.setState({
      modal: true,
      modalUser: lineup
    });
  }

  handlingEdit(item) {
    console.log("handing edit", item, Array.isArray(item));
    this.setState({
      modal: true,
      modalContent: item
    });
  }

  updateDataSource() {
    const self = this;

    function fieldify2antDataTable(schema, wire) {
      if (!wire) wire = "";
      const current = [];
      utils.orderedRead(schema, (index, item) => {
        const path = wire + "." + item.$_key;
        item.$_path = path;

        if (Array.isArray(item)) {
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
            ptr: item,
            key: path,
            name: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tooltip, {
              title: "This field is an array ..."
            }, /*#__PURE__*/React.createElement(Tag, {
              color: "#eb2f96"
            }, /*#__PURE__*/React.createElement(CopyOutlined, null))), composite, /*#__PURE__*/React.createElement("strong", null, item.$_key)),
            doc: item.$doc,
            children: !("$type" in item[0]) ? fieldify2antDataTable(item[0], path) : null,
            actions: /*#__PURE__*/React.createElement("div", {
              className: "ant-radio-group ant-radio-group-outline ant-radio-group-small"
            }, /*#__PURE__*/React.createElement(Popconfirm, {
              title: /*#__PURE__*/React.createElement("span", null, "Are you sure to delete the Array ", /*#__PURE__*/React.createElement("strong", null, path)),
              onConfirm: () => self.itemRemove(item),
              okText: "Yes",
              cancelText: "No"
            }, /*#__PURE__*/React.createElement("span", {
              className: "ant-radio-button-wrapper"
            }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DeleteOutlined, null)))), /*#__PURE__*/React.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: () => self.handlingEdit(item)
            }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(EditOutlined, null))), !("$type" in item[0]) ? /*#__PURE__*/React.createElement("span", {
              className: "ant-radio-button-wrapper",
              onClick: () => self.handlingAdd(path)
            }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(PlusOutlined, null))) : null)
          });
        } else if (typeof item === "object" && !item.$type) {
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
          } else if (item.$type) {
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
      data = fieldify2antDataTable(this.schema.tree);
      return data;
    }

    return [];
  }

  render() {
    const sds = this.state.schemaDataSource;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FieldifySchemaBuilderModal, {
      user: this.state.modalUser,
      visible: this.state.modal,
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

class FieldifySchemaRender extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, "test");
  }

}

var schema = {
  __proto__: null,
  FieldifySchemaRender: FieldifySchemaRender,
  FieldifySchemaBuilder: FieldifySchemaBuilder,
  FieldifySchemaForm: FieldifySchemaForm,
  FieldifySchema: FieldifySchema
};

class Input extends input {}
const Schema = schema;
const Types = types;

export { Input, Schema, Types };
//# sourceMappingURL=index.modern.js.map
