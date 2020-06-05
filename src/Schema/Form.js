import { utils, input as FieldifyInput } from "fieldify";
import React from 'react';
import RecycledComponent from 'react-recycling';

import { Form, Table, Button, Input, Card } from "antd";
import {
  PlusOutlined as PlusIcon,
  DeleteOutlined as DeleteIcon
} from '@ant-design/icons';

import { FieldifySchema } from "../Schema/Schema";
import { TypeDataset } from "../lib/TypeDataset";

export class FieldifySchemaForm extends RecycledComponent {
  cycle(props) {
    const state = {
      layout: props.layout,
      schema: props.schema,
      input: props.input,
      onChange: props.onChange,
    }

    return(state)
  }

  render() {
    return (<TypeDataset
      schema={this.state.schema}
      input={this.state.input}
      onChange={this.state.onChange}
      actions={true}
      layout={this.state.layout}
      generator="Form"
    />);
  }
}
