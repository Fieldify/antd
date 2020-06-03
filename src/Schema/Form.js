import { utils, input as FieldifyInput } from "fieldify";
import React from 'react';
import RecycledComponent from 'react-recycling';

import { Form, Table, Button, Input, Card } from "antd";
import {
  PlusOutlined as PlusIcon,
  DeleteOutlined as DeleteIcon
} from '@ant-design/icons';

export class FieldifySchemaForm extends RecycledComponent {
  constructor(props) {
    super(props)

    this.formRef = React.createRef()
  }

  cycle(props, first) {
    const state = {}

    this.schema = props.schema;
    this.input = props.input;

    if (!this.input || !(typeof props.input === "object")) {
      this.input = new FieldifyInput(this.schema)
    }

    state.input = this.input.getValue()
    state.verify = props.verify || false

    state.reactive = this.update(state.input, state.verify);

    this.references = {};

    this.onChange = props.onChange ? props.onChange : () => { };

    return (state)
  }

  clickAddArray(line) {
    this.input.set(line)
    const _value = this.input.getValue();
    this.onChange(_value)
    this.setState({
      input: _value,
      reactive: this.update(_value, false)
    })
  }

  clickRemoveArrayItem(line) {
    this.input.remove(line)
    const _value = this.input.getValue();
    this.onChange(_value)
    this.setState({
      input: _value,
      reactive: this.update(_value, false)
    })
  }

  setValue(line, value) {
    this.input.set(line, value)
    const _value = this.input.getValue();
    this.onChange(_value)
    this.setState({
      input: _value
    })
  }

  input(input, verify) {
    // const state = {
    //   verify,
    //   input
    // }    
    // state.reactive = this.update(input, verify)
    // this.setState(state)
  }

  update(input, verify) {

    console.log("rebuild", input)
    const follower = (schema, schematized, input, ret, line) => {
      line = line || ""

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
          else {
            delete sourceSchematized.$doc; // source is cloned
            const TypeForm = source.$type.Form;

            // console.log("Array non nested", min, inputPtr2)

            if (verify === true) {
              // console.log()
            }

            if (!Array.isArray(inputPtr)) {
              input[item.$_key] = [];
              inputPtr2 = input[item.$_key];
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
                <span className="ant-radio-button-wrapper" onClick={() => this.clickAddArray(lineKey + "." + inputPtr2.length)}>
                  <span><PlusIcon /></span>
                </span>
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
          else {
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
      this.schema.handler.schema,
      this.schema.handlerSchematized.schema,
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
