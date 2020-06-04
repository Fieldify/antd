import { utils, input as FieldifyInput } from "fieldify";
import React from 'react';
import RecycledComponent from 'react-recycling';

import { Form, Table, Button, Input, Card } from "antd";
import {
  PlusOutlined as PlusIcon,
  DeleteOutlined as DeleteIcon
} from '@ant-design/icons';

import { FieldifySchema } from "../Schema/Schema";

export class FieldifySchemaRender extends RecycledComponent {
  constructor(props) {
    super(props)

    this.formRef = React.createRef()
  }

  cycle(props, first) {

    const state = {
      layout: props.layout ? props.layout : "horizontal"
    }

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

  update(root, input, verify) {
    const follower = (schema, input, ret, line) => {
      line = line || ""

      utils.orderedRead(schema, (index, item) => {
        const source = { ...Array.isArray(item) ? item[0] : item };
        const inputPtr = input ? input[source.$_key] : null;
        const lineKey = line + "." + source.$_key;

        if (source.$_array === true) {
          const columns = [
            {
              dataIndex: 'form',
              key: 'form',
              width: "100%"
            }
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
              follower(source, value, child, key);

              dataSource.push({
                key,
                form: child
              })
            }
          }
          else if(source.$type) {
            delete source.$doc; // source is cloned
            const TypeRender = source.$type.Render;

            // console.log("Array non nested", min, inputPtr2)

            if (verify === true) {
              // console.log()
            }

            if (TypeRender) {
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
                  form: <TypeRender
                    schema={source}
                    value={value}
                    injected={true}
                    key={"render."+source.$_wire}
                  />
                })
              }

            }

          }

          ret.push(<Form.Item key={source.$_wire} noStyle={true}>
            <div className="ant-form-item">
              <Card size="small" title={source.$_access.$doc}>
                <Table
                  size="small"
                  dataSource={dataSource}
                  columns={columns}
                  showHeader={false}
                  pagination={{
                    total: dataSource.length,
                    pageSize: dataSource.length,
                    hideOnSinglePage: true
                  }}
                />
              </Card>
            </div>
          </Form.Item>);

        }
        else {
          if (source.$_nested === true) {
            const child = [];
            follower(source, inputPtr, child, lineKey);

            ret.push(<div key={"render."+source.$_wire} className="ant-form-item">
              <Card size="small" title={source.$doc}>
                {child}
              </Card>
            </div>);
          }
          else {
            const TypeRender = item.$type.Render;
            if (TypeRender) {
              ret.push(<TypeRender
                schema={source}
                value={inputPtr}
                key={"render."+source.$_wire}
              />);
            }
          }
        }
      });
      return (ret);
    };

    const ret = [];
    follower(root.handler.schema, input, ret);
    return (ret);
  }

  render() {
    var layout = {};

    if (this.state.layout === 'horizontal') {
      layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      }
    }
    return (<Form
      layout={this.state.layout}
      key={this.formRef}
      {...layout}
      name="basic" >
      {this.state.reactive}
    </Form>);
  }
}
