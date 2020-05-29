import { input as FieldifyInput } from "fieldify";

import React from 'react';
import Types from '../Types';
import { Modal, Form, Input, Select, Checkbox, Tag } from "antd";
import { FieldifySchema } from "../Schema/Schema";
import { FieldifySchemaForm } from './Form'

// build all available types
const allTypes = {}
for (var a in Types) {
  allTypes[a] = Types[a].description
}

// set the very basic schema for the modal
const baseSchema = {
  key: {
    $doc: "Name of the field",
    $type: Types.FieldName,
    $required: true
  },
  type: {
    $doc: "Field type",
    $type: Types.Select,
    $required: true,
    $options: {
      items: allTypes
    }
  },
  doc: {
    $doc: "Description",
    $required: true,
    $type: Types.String
  },
  // options: {
  //   $doc: "Options",
  //   $type: Types.Checkbox,
  //   $options: {
  //     required: "Field is required",
  //     readOnly: "Field is read only",
  //   }
  // },
}

export class FieldifySchemaBuilderModal extends React.Component {
  constructor(props) {
    super(props);

    this.formRef = React.createRef()
    this.state = this.cycle(props, true)
    this.currentSchema = baseSchema
  }

  componentDidUpdate(props) {
    var changed = false
    var state = { ...this.state }

    if (this.props.visible !== props.visible) {
      this.currentSchema = baseSchema
      state = this.cycle(this.props)
      changed = true;
    }

    if (changed === true) this.setState(state)
  }

  cycle(props, first) {

    const state = {
      form: {
        state: "Filling",
        color: "blue"
      },
      value: {},
      visible: props.visible,
      user: props.user
    };

    if (props.value) {
      state.value = {
        key: props.value.$_key,
        type: props.value.$type.code,
        doc: props.value.$doc,
        options: props.value.$options,
      }
    }
    else {
      state.value = {}
    }

    // const Type = Types[state.value.type]
    // if (Type) {
    //   // create a fake tmp type
    //   const TypeObject = new Type.class

    //   const configuration = TypeObject.configuration()

    //   this.currentSchema = { ...baseSchema }
    //   if (configuration) this.currentSchema.options = {
    //     ...configuration,
    //     $doc: "Type configuration"
    //   };

    //   // const upSchema = Type.
    //   this.currentType = Type;
    // }

    // state.schema = new FieldifySchema("modal");
    // state.schema.compile(this.currentSchema);
    // state.input= new FieldifyInput(state.schema)

    // if (props.value) this.input.setValue(state.value)
    this.driveSchema(state)

    state.input.setValue(state.value)

    return (state)
  }

  driveSchema(state) {
    const value = state.value;

    const Type = Types[value.type]
    if (Type && Type !== this.currentType) {

      // create a fake tmp type
      const TypeObject = new Type.class

      const configuration = TypeObject.configuration()

      this.currentSchema = { ...baseSchema }
      if (configuration) this.currentSchema.options = {
        ...configuration,
        $doc: "Type configuration"
      };

      // const upSchema = Type.
      this.currentType = Type;

      state.schema = new FieldifySchema("modal");
      state.schema.compile(this.currentSchema);
      state.input = new FieldifyInput(state.schema)

    }
    else if(!state.schema) {
      state.schema = new FieldifySchema("modal");
      state.schema.compile(this.currentSchema);
      state.input = new FieldifyInput(state.schema)
    }


  }


  formChanged(value) {

    const state = {
      schema: this.state.schema,
      input: this.state.input,
      value: { ...this.state.value, ...value }
    }
    console.log("state", state)
    this.driveSchema(state)
    state.input.setValue(state.value)
    this.setState(state)

    state.input.verify((result) => {
      const state = { form: {} }

      state.error = result.error

      if (result.error === true) {
        state.form.color = "blue"
        state.form.state = "Filling"
      }
      else {
        state.form.color = "green"
        state.form.state = "Passed"
      }

      this.setState(state)
    })
    console.log("formChanged", value, state)

  }

  render() {
    const onOk = () => {
      // this.onOk(this.state);
    };
    const onCancel = () => {
      // this.setState({ visible: false });
      this.props.onCancel(this.state);
    };
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (<Modal
      title={<span>Add New Field To Your Schema <Tag color={this.state.form.color}>{this.state.form.state}</Tag></span>}
      centered
      visible={this.state.visible}
      width={600}
      onOk={onOk}
      onCancel={onCancel}
    >

      <FieldifySchemaForm
        ref={this.formRef}
        schema={this.state.schema}
        input={this.state.input}
        user={this.props.user}
        onChange={this.formChanged.bind(this)}
      />

    </Modal>);
  }
}
