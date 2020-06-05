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

export class FieldifySchemaRender extends RecycledComponent {
  cycle(props) {
    const state = {
      layout: props.layout,
      schema: props.schema,
      input: props.input,
    }

    return(state)
  }

  render() {
    return (<TypeDataset
      schema={this.state.schema}
      input={this.state.input}
      actions={false}
      layout={this.state.layout}
      generator="Render"
    />);
  }
}
