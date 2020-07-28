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
class DateTimePickerForm extends TypeForm {
  render() {
    return (super.render(
      <DatePicker showTime defaultValue={this.state.value} onChange={(date) => {
        if(date) this.changeValue(date.format())
        else this.changeValue(null)
      }}
      />
    ));
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class DateTimePickerInfo extends TypeInfo {
  render() {
    return (
      <span>
        <Tag color="#fa541c"><FieldTimeOutlined /></Tag>
      </span>
    )
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class DateTimePickerRender extends TypeRender {
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Complement builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class DateTimePickerBuilder extends TypeBuilder {
  constructor(props) {
    super(props)
    this.configure()
  }
}


export default {
  code: types.DateTimePicker.code,
  description: types.DateTimePicker.description,
  class: types.DateTimePicker.class,

  Info: DateTimePickerInfo,
  Builder: DateTimePickerBuilder,
  Form: DateTimePickerForm,
  Render: DateTimePickerRender
}