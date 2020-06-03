import { types } from 'fieldify'

import React from 'react';

import {
  Checkbox,
  Form,
  Tag,
  Input,
  Col,
  Row
} from "antd";

import { MailOutlined } from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeRender from '../lib/TypeRender';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class EmailForm extends TypeForm {
  render() {
    return (super.render(
      <Input value={this.state.value} placeholder={this.state.options.placeholder} onChange={({ target }) => this.changeValue(target.value)} />
    ));
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class EmailInfo extends TypeInfo {
  render() {
    return (
      <span>
        <Tag color="#1890ff"><MailOutlined /></Tag>
      </span>
    )
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class EmailRender extends TypeRender {
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Complement builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class EmailBuilder extends TypeBuilder {
  constructor(props) {
    super(props)

    this.default = {
      subAddressing: true
    }

    this.configure()
  }

  render() {
    return (
      <div>
        <Form.Item label="Sub-addressing">
          <Checkbox checked={this.state.subAddressing} onChange={({ target }) => this.changeIt("subAddressing", target.checked)}>Allowed</Checkbox>
        </Form.Item>
      </div>
    )
  }
}


export default {
  code: types.Email.code,
  description: types.Email.description,
  class: types.Email.class,

  Info: EmailInfo,
  Builder: EmailBuilder,
  Form: EmailForm,
  Render: EmailRender
}