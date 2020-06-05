import { utils, input as FieldifyInput } from "fieldify";
import React from 'react';
import RecycledComponent from 'react-recycling';

import { Form, Table, Button, Input, Card } from "antd";
import {
  PlusOutlined as PlusIcon,
  DeleteOutlined as DeleteIcon
} from '@ant-design/icons';

import { FieldifySchema } from "../Schema/Schema";


export class FieldifySchemaForm extends RecycledComponent {
  constructor(props) {
    super(props)

    this.formRef = React.createRef()

  }

  cycle(props, first) {

    const state = {}

    // compile the schema
    state.rawSchema = props.schema
    state.schema = new FieldifySchema("form")
    state.schema.compile(state.rawSchema)

    // create an input instance
    // console.log("rawInput", state.rawInput === props.rawInput)
    state.rawInput = props.input
    state.input = new FieldifyInput(state.schema)
    state.input.setValue(props.input)

    state.inputValue = state.input.getValue()
    state.verify = props.verify || false

    this.references = {};

    this.onChange = props.onChange ? props.onChange : () => { };

    state.reactive = this.update(state.schema, state.inputValue, state.verify);

    return (state)
  }

  getValue() {
    return (this.state.input.getValue())
  }

  clickAddArray(line) {
    this.state.input.set(line)
    const _value = this.state.input.getValue();
    this.onChange(this.state.input, _value)
    this.setState({
      inputValue: _value,
      reactive: this.update(this.state.schema, _value, false)
    })
  }

  clickRemoveArrayItem(line) {
    this.state.input.remove(line)
    const _value = this.state.input.getValue();
    this.onChange(this.state.input, _value)
    this.setState({
      inputValue: _value,
      reactive: this.update(this.state.schema, _value, false)
    })
  }

  setValue(line, value) {
    if (!this.state.input) return;

    this.state.input.set(line, value)
    const _value = this.state.input.getValue();
    this.onChange(this.state.input, _value)
    this.setState({
      inputValue: _value
    })
  }

  update(root, input, verify) {
    const follower = (schema, schematized, input, ret, line) => {
      line = line || ""

      if(!input) input = {}

      utils.orderedRead(schema, (index, item) => {

        const source = { ...Array.isArray(item) ? item[0] : item };
        const schematizedSrc = schematized[source.$_key];
        const sourceSchematized = { ...Array.isArray(schematizedSrc) ? schematizedSrc[0] : schematizedSrc };

        const inputPtr = input ? input[source.$_key] : null;
        const lineKey = line + "." + source.$_key;

        if (source.$_array === true) {
          const columns = [
            {
              dataIndex: 'form',
              key: 'form',
              width: "100%"
            },
            {
              dataIndex: 'actions',
              key: 'actions',
              align: "right"
            },
          ];
          const dataSource = []

          var inputPtr2 = inputPtr;
          const options = source.$array || {};
          const min = options.min ? options.min : (source.$required === true ? 1 : 0)

          if (source.$_nested === true) {
            var inputPtr2 = input[source.$_key]

            if (!Array.isArray(inputPtr)) inputPtr2 = input[source.$_key] = [];

            // force to create min form
            if (min - inputPtr2.length > 0) {
              for (var a = 0; a <= min - inputPtr2.length; a++) {
                inputPtr2.push({})
              }
            }

            for (var a = 0; a < inputPtr2.length; a++) {
              const value = inputPtr2[a];
              const key = lineKey + "." + a

              const child = [];
              follower(source, sourceSchematized, value, child, key);

              dataSource.push({
                key,
                form: child,
                actions: <Button size="small" onClick={() => this.clickRemoveArrayItem(key)}>
                  <span><DeleteIcon /></span>
                </Button>
              })
            }
          }
          else if (source.$type) {
            delete sourceSchematized.$doc; // source is cloned
            const TypeForm = source.$type.Form;

            // console.log("Array non nested", min, inputPtr2)

            if (verify === true) {
              // console.log()
            }

            if (!Array.isArray(inputPtr)) {
              input[source.$_key] = [];
              inputPtr2 = input[source.$_key];
            }

            if (!inputPtr2) return (ret);

            if (min - inputPtr2.length > 0) {
              for (var a = 0; a <= min - inputPtr2.length; a++) {
                inputPtr2.push(null)
              }
            }

            for (var a = 0; a < inputPtr2.length; a++) {
              const value = inputPtr2[a];
              const key = lineKey + "." + a

              dataSource.push({
                key,
                form: <TypeForm
                  schema={sourceSchematized}
                  value={value}
                  verify={verify}
                  user={this.props.user}
                  onChange={(schema, value) => this.setValue(key, value)}
                  isInjected={true}

                  // reference errors
                  onError={(error, message) => {
                    if (error === true) {
                      this.references[key] = message;
                    }
                    else {
                      const ref = this.references[key];
                      if (ref) {
                        delete this.references[key];
                      }
                    }
                  }}
                />,
                actions: <Button size="small" onClick={() => this.clickRemoveArrayItem(key)}>
                  <span><DeleteIcon /></span>
                </Button>
              })
            }
          }

          ret.push(<Form.Item key={source.$_wire} noStyle={true}>
            <div className="ant-form-item">
              <Card size="small" title={source.$_access.$doc} extra={<div className="ant-radio-group ant-radio-group-outline ant-radio-group-small">
                {inputPtr2 ?
                  <span className="ant-radio-button-wrapper" onClick={() => this.clickAddArray(lineKey + "." + inputPtr2.length)}>
                    <span><PlusIcon /></span>
                  </span>
                  : null}
              </div>}>
                <Table
                  size="small"
                  dataSource={dataSource}
                  columns={columns}
                  verticalAlign='middle'
                  showHeader={false}
                  pagination={{
                    total: dataSource.length,
                    pageSize: dataSource.length,
                    hideOnSinglePage: true
                  }}
                  bordered
                />
              </Card>
            </div>
          </Form.Item>);

        }
        else {
          if (source.$_nested === true) {
            const child = [];

            follower(source, sourceSchematized, inputPtr, child, lineKey);

            ret.push(<div key={source.$_wire} className="ant-form-item">
              <Card size="small" title={source.$doc}>
                {child}
              </Card>
            </div>);
          }
          else if (item.$type) {
            const TypeForm = item.$type.Form;

            ret.push(<TypeForm
              schema={sourceSchematized}
              value={inputPtr}
              key={source.$_wire}
              verify={verify}
              user={this.props.user}
              onChange={(schema, value) => this.setValue(lineKey, value)}

              // reference errors
              onError={(error, message) => {
                if (error === true) {
                  this.references[source.$_wire] = message;
                }
                else {
                  const ref = this.references[source.$_wire];
                  if (ref) {
                    delete this.references[source.$_wire];
                  }
                }
              }}
            />);
          }
        }
      });
      return (ret);
    };

    const ret = [];
    follower(
      root.handler.schema,
      root.handlerSchematized.schema,
      input,
      ret
    );
    return (ret);
  }

  render() {

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (<Form
      key={this.formRef}
      {...layout}
      name="basic" >
      {this.state.reactive}
    </Form>);
  }
}
