
import { types } from 'fieldify'

import React from 'react';

import {
  InputNumber,
  Form,
  Space,
  Tag,
  Input,
  Radio,
  Col,
  Row
} from "antd";

import { FieldBinaryOutlined as Icon } from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeRender from '../lib/TypeRender';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';

const _radioVertical = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field in a form
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class RadioForm extends TypeForm {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value,
      options: {}
    }

    if (props.schema.$options) this.state.options = props.schema.$options

    if (!this.state.value && this.state.options.default) {
      this.state.value = this.state.options.default
      // inform the change
      this.onChange(this.schema, this.state.value);
    }

    this.state.items = this.updateItems()
  }

  componentDidUpdate(props, state) {
    // if(state.options.default !== this.state.options.default) changed = true;
    // if(state.items !== this.state.items) changed = true;
    // if(state.options.horizontal !== this.state.options.horizontal) changed = true;

    if (props.schema !== this.props.schema) {
      this.setState({
        options: props.schema.$options,
        items: this.updateItems()
      });
      this.onChange(this.schema, this.state.value);
    }

    // if(changed === true) this.setState({items: this.updateItems()})
  }

  updateItems() {
    var style = _radioVertical;
    if(this.props.schema.$options.horizontal === true) style = null;
    if (!this.props.schema.$options.items) return ([])

    const options = []
    for (var key in this.props.schema.$options.items) {
      const value = this.props.schema.$options.items[key];
      options.push(<Radio style={style} value={key} key={key}>{value}</Radio>)
    }

    return (options)
  }

  render() {
    return (super.render(
      <Radio.Group value={this.state.value} onChange={({ target }) => this.changeValue(target.value) }>
        {this.state.items}
      </Radio.Group>
    ))
  }
}





/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field show fancy information of the type
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class RadioInfo extends TypeInfo {
  render() {
    return (
      <span>
        <Tag color="#096dd9" style={{ color: "white" }}><Icon /></Tag>
      </span>
    )
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class RadioRender extends TypeRender {
  static getDerivedStateFromProps(props, state) {
    if (typeof state.value === "string") {

      if (props.schema.$options && props.schema.$options.items) {
        const ptr = props.schema.$options.items
        if (ptr[state.value]) state.value = ptr[state.value]
      }
    }
    return (state)
  }

}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Field builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class RadioBuilder extends TypeBuilder {
  constructor(props) {
    super(props)

    this.default = {
      minSize: 1,
      maxSize: 128
    }

    this.configure()
  }

  render() {
    return (
      <div>
        <Form.Item label="Radio min/max size">
          <Space>
            <InputNumber min={0} value={this.state.minSize} onChange={(value) => this.changeIt("minSize", value)} />

            <InputNumber min={0} value={this.state.maxSize} onChange={(value) => this.changeIt("maxSize", value)} />
          </Space>
        </Form.Item>

      </div>
    )
  }
}

export default {
  code: types.Radio.code,
  description: types.Radio.description,
  class: types.Radio.class,

  Info: RadioInfo,
  Builder: RadioBuilder,
  Form: RadioForm,
  Render: RadioRender
}


