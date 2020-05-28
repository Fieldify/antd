
import { types } from 'fieldify'

import React from 'react';

import {
  InputNumber,
  Form,
  Space,
  Tag,
  Input,
  Select,
  Col,
  Row
} from "antd";

import { FieldStringOutlined as Icon } from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field in a form
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class SelectForm extends TypeForm {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value,
      options: {}
    }

    if (props.schema.$options) this.state.options = props.schema.$options

    this.state.items = this.updateItems()
  }

  updateItems() {
    if (!this.state.options.items) return ([])

    const options = []
    for (var key in this.state.options.items) {
      const value = this.state.options.items[key];
      options.push(<Select.Option value={key} key={key}>{value}</Select.Option>)
    }

    return (options)
  }

  render() {
    return (super.render(
      <Select value={this.state.value} onChange={(value) => this.changeValue(value)}>
        {this.state.items}
      </Select>
    ))
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field show fancy information of the type
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class SelectInfo extends TypeInfo {
  render() {
    return (
      <span>
        <Tag color="#fadb14" style={{ color: "#555555" }}><Icon /></Tag>
      </span>
    )
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Field builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class SelectBuilder extends TypeBuilder {
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
        <Form.Item label="Select min/max size">
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
  code: types.Select.code,
  description: types.Select.description,
  class: types.Select.class,

  Info: SelectInfo,
  Builder: SelectBuilder,
  Form: SelectForm
}


