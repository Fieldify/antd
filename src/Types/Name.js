
import { types } from 'fieldify'

import React from 'react';

import {
  InputNumber,
  Form,
  Space,
  Tag,
  Input,
  Col,
  Row
} from "antd";

import { UserSwitchOutlined as Icon } from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeRender from '../lib/TypeRender';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';

import TString from './String';

const StringForm = TString.Form

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field in a form
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class NameForm extends TypeForm {
  constructor(props) {
    super(props)
  }

  cycle(props) {
    console.log("NameForm", props)
    const ret = super.cycle(props)
    if (!ret.value) ret.value = {}
    
    this.result = {...ret.value}
    return (ret)
  }

  error(from, error, message) {
    // this.setState({
    //   help: "Please fill the form"
    // })
  }

  setField(key, schema, value) {
    this.result[key] = value;
    this.onChange(this.schema, this.result);
  }

  render() {

    return (super.render(
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <StringForm
            schema={this.schema.first}
            verify={this.state.verify}
            value={this.state.value.first}
            onChange={(schema, value) => this.setField("first", schema, value)}
            // onError={(error, message) => this.error("first", error, message)}
            isInjected={true}
          />
        </Col>
        <Col className="gutter-row" span={12}>
          <StringForm
            schema={this.schema.last}
            verify={this.state.verify}
            value={this.state.value.last}
            onChange={(schema, value) => this.setField("last", schema, value)}
            // onError={(error, message) => this.error("last", error, message)}
            isInjected={true}
          />
        </Col>
      </Row>
    ))
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field show fancy information of the type
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class NameInfo extends TypeInfo {
  render() {
    return (
      <span>
        <Tag color="#36cfc9" style={{ color: "#555555" }}><Icon /></Tag>
      </span>
    )
  }
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class NameRender extends TypeRender {
  static getDerivedStateFromProps(props, state) {
    if(state.value && typeof state.value === "object") {
      var final = ""

      if(state.value.first) final += state.value.first
      if(state.value.last) final += " "+state.value.last

      state.value = final.trim()
    }
    return(state)
  }
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Field builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class NameBuilder extends TypeBuilder {
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
        <Form.Item label="Name min/max size">
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
  code: types.Name.code,
  description: types.Name.description,
  class: types.Name.class,

  Info: NameInfo,
  Builder: NameBuilder,
  Form: NameForm,
  Render: NameRender,

  noFormItem: true
}


