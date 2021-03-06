import { types } from 'fieldify'

import React from 'react';

import {
  Checkbox,
  Form,
  Tag,
  Input,
  Col,
  Row,
  DatePicker
} from "antd";

import { FieldTimeOutlined } from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeRender from '../lib/TypeRender';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class DatePickerForm extends TypeForm {
  render() {
    return (super.render(
      <DatePicker defaultValue={this.state.value} onChange={(date, dateString) => this.changeValue(dateString)} />
    ));
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class DatePickerInfo extends TypeInfo {
  render() {
    return (
      <span>
        <Tag color="#ad2102"><FieldTimeOutlined /></Tag>
      </span>
    )
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class DatePickerRender extends TypeRender {
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Complement builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class DatePickerBuilder extends TypeBuilder {
  constructor(props) {
    super(props)
    this.configure()
  }
}


export default {
  code: types.DatePicker.code,
  description: types.DatePicker.description,
  class: types.DatePicker.class,

  Info: DatePickerInfo,
  Builder: DatePickerBuilder,
  Form: DatePickerForm,
  Render: DatePickerRender
}