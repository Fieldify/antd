import React from 'react';
import { utils, input as FieldifyInput } from "fieldify";
import { Form, Table, Button, Input, Card } from "antd";
import {
  PlusOutlined as PlusIcon,
  DeleteOutlined as DeleteIcon
} from '@ant-design/icons';

export class FieldifySchemaForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.cycle(props, true);
  }

  componentDidUpdate(props, state) {
    if (this.props !== props) {
      const cycle = this.cycle(this.props);
      this.setState(cycle)
    }
  }

  cycle(props, first) {
    this.schema = props.schema;
    this.input = props.input;

    if (!this.input || !(typeof props.input === "object")) {
      this.input = new FieldifyInput(this.schema)
    }

    const state = {
      input: this.input.getValue(),
      // verify: props.verify
    };

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
    const follower = (schema, input, ret, line) => {
      line = line || ""

      utils.orderedRead(schema, (index, item) => {
        const inputPtr = input ? input[item.$_key] : null;
        const lineKey = line+"."+item.$_key;
        
        // check if the item is hidden
        if (item.hidden === true)
          return;

        // ARRAY
        if (Array.isArray(item)) {
          const source = { ...item[0] };
          var inputPtr2 = inputPtr;
          const options = source.$array || {};
          const min = options.min ? options.min : (source.$required === true ? 1 : 0)

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

          /*
           * Is an array with non nested schema inside
           */
          if (source.$_array === true && source.$_nested !== true) {
            
            delete source.$doc; // source is cloned
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
                  schema={source}
                  value={value}
                  // verify={verify}
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
          /*
           * Is an array with nested schema inside
           */
          else if (source.$_array === true && source.$_nested === true) {
            var inputPtr2 = input[item.$_key]

            // console.log("Schema has nested array", item.$_wire, item.$_key, verify, source, input[item.$_key], input)

            if (!Array.isArray(inputPtr)) inputPtr2 = input[item.$_key] = [];

            // console.log("Array nested", min, min - inputPtr2.length, inputPtr2)

            // force to create min form
            if (min - inputPtr2.length > 0) {
              for (var a = 0; a <= min - inputPtr2.length; a++) {
                inputPtr2.push({})
              }
            }

            // very special case for field where there is subfield
            if (item[0].$_schematized === true) {
              delete source.$doc; // source is cloned
              const TypeForm = source.$type.Form;

              for (var a = 0; a < inputPtr2.length; a++) {
                const value = inputPtr2[a];
                const key = lineKey + "." + a
      
                dataSource.push({
                  key,
                  form: <TypeForm
                    schema={source}
                    value={value}
                    // verify={verify}
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
            else {
              for (var a = 0; a < inputPtr2.length; a++) {
                const value = inputPtr2[a];
                const key = lineKey + "." + a

                const child = [];
                follower(item.$_ptr[0], value, child, key);

                dataSource.push({
                  key,
                  form: child,
                  actions: <Button size="small" onClick={() => this.clickRemoveArrayItem(key)}>
                    <span><DeleteIcon /></span>
                  </Button>
                })
              }
            }

          }

          ret.push(<Form.Item key={item.$_wire} noStyle={true}>
            <div className="ant-form-item">
              <Card size="small" title={source.$_access.$doc} extra={<div className="ant-radio-group ant-radio-group-outline ant-radio-group-small">
                <span className="ant-radio-button-wrapper" onClick={() => this.clickAddArray(lineKey+"."+inputPtr2.length)}>
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
        // OBJECT
        else if (typeof item === "object" && !item.$type) {
          const child = [];
          follower(item.$_ptr, inputPtr, child, lineKey);
          ret.push(<div key={item.$_wire} className="ant-form-item">
            <Card size="small" title={item.$doc}>
              {child}
            </Card>
          </div>);
        }
        // LEAF
        else {
          const TypeForm = item.$type.Form;

          ret.push(<TypeForm
            schema={item}
            value={inputPtr}
            key={item.$_wire}
            // verify={verify}
            user={this.props.user}
            onChange={(schema, value) => this.setValue(lineKey, value)}

            // reference errors
            onError={(error, message) => {
              if (error === true) {
                this.references[item.$_key] = message;
              }
              else {
                const ref = this.references[item.$_key];
                if (ref) {
                  delete this.references[item.$_key];
                }
              }
            }}
          />);
        }
      });
      return (ret);
    };


    const ret = [];
    follower(this.schema.handler.schema, input, ret);
    return (ret);
  }

  render() {

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (<Form {...layout} name="basic">
      {this.state.reactive}
    </Form>);
  }
}
