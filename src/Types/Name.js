
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
    const ret = super.cycle(props)
    if(!ret.value) ret.value = {}
    return(ret)
  }

  error(from, error, message) {

    // this.setState({
    //   help: "Please fill the form"
    // })
  }

  render() {
 
    return (super.render(
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <StringForm
            schema={this.schema.first}
            verify={this.state.verify}
            value={this.state.value.first}
            onChange={() => console.log("First name changed")}
            // onError={(error, message) => this.error("first", error, message)}
            isInjected={true}
          />
        </Col>
        <Col className="gutter-row" span={12}>
        <StringForm
            schema={this.schema.last}
            verify={this.state.verify}
            value={this.state.value.last}
            onChange={() => console.log("Last name changed")}
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

  noFormItem: true
}


