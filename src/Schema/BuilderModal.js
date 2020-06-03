import { utils, input as FieldifyInput } from "fieldify";

import React from 'react';
import Types from '../Types';
import { Modal, Form, Input, Select, Checkbox, Tag } from "antd";
import { FieldifySchema } from "../Schema/Schema";
import { FieldifySchemaForm } from './Form'
import { ConsoleSqlOutlined } from "@ant-design/icons";

// build all available types
const allTypes = {}
const allTypesNoArray = {}
for (var a in Types) {
  allTypes[a] = Types[a].description
  if (a !== "Array") {
    allTypesNoArray[a] = Types[a].description
  }
}

// set the very basic schema for the modal
const baseSchema = {
  key: {
    $doc: "Name of the field",
    $type: Types.FieldName,
    $required: true,
    $position: 10
  },
  type: {
    $doc: "Field type",
    $type: "Select",
    $required: true,
    $options: {
      items: allTypes
    },
    $position: 11
  },
  doc: {
    $doc: "Description",
    $required: false,
    $type: "String",
    $position: 22
  },
  position: {
    $doc: "Position in the serie",
    $required: false,
    $type: "Number",
    $default: 0,
    $options: {
      acceptedTypes: "integer"
    },
    $position: 23
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
    // here we have 3 cases
    // normal case = $_array !== true && $_nested !== true
    // nested in array = $_array === true && $_nested === true
    // normal in array = $_array === true && $_nested !== true
    // single nested = $_array !== true && $_nested === true

    const state = {
      edition: false,
      original: props.value,
      form: {
        state: "Filling",
        color: "blue"
      },
      value: {},
      visible: props.visible,
      user: props.user,
      verify: false
    };

    if (state.user && state.user.$_wire) {
      state.initialPath = state.user.$_wire;
    }
    else state.initialPath = '';

    if (props.value) {
      const val = props.value;

      state.edition = true;

      // normal case
      if (val.$_array !== true && val.$_nested !== true) {
        state.value = {
          key: val.$_key,
          type: val.$type.code,
          doc: val.$doc,
          required: val.$required,
          read: val.$read,
          write: val.$write,
          options: val.$options,
          position: val.$position,
        }
      }
      // nested in array
      else if (val.$_array === true && val.$_nested === true) {
        state.value = {
          key: val.$_key,
          type: "Array",
          content: "Object",
          doc: val.$doc,
          required: val.$required,
          read: val.$read,
          write: val.$write,
          options: val.$options,
          position: val.$position,
        }
      }
      // normal in array
      else if (val.$_array === true && val.$_nested !== true) {
        state.value = {
          key: val.$_key,
          type: "Array",
          content: typeof val.$type === "string" ? val.$type : val.$type.code,
          doc: val.$doc,
          required: val.$required,
          read: val.$read,
          write: val.$write,
          options: val.$options,
          position: val.$position,
        }
      }
      // special handle for objects
      else if (val.$_array !== true && val.$_nested === true) {
        state.value = {
          key: val.$_key,
          type: "Object",
          doc: val.$doc,
          required: val.$required,
          read: val.$read,
          write: val.$write,
          options: val.$options,
          position: val.$position,
        }
      }
    }
    // single addition
    else {
      // nothing to set
      state.value = {}
    }

    this.driveSchema(state)
    state.input.setValue(state.value)
    return (state)
  }

  driveSchema(state, force) {
    const value = state.value;

    const Type = Types[value.type]
    if (Type && Type !== this.currentType) {
      // create a fake tmp type
      const TypeObject = new Type.class

      const configuration = TypeObject.configuration()

      this.currentSchema = { ...baseSchema }

      // special cases for array 
      if (value.type === "Array") {
        this.currentSchema.content = {
          $doc: "Item content type",
          $type: "Select",
          $required: true,
          $options: {
            default: value.content || "Object",
            items: allTypesNoArray
          },
          $position: 12
        }
      }

      if (configuration) this.currentSchema.options = {
        ...configuration,
        $doc: "Type configuration"
      };

      // const upSchema = Type.
      state.currentType = Type;

      state.schema = new FieldifySchema("modal");
      state.schema.compile(this.currentSchema);
      state.input = new FieldifyInput(state.schema)

    }
    else if (!state.schema || force === true) {
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

    this.driveSchema(state)
    state.input.setValue(state.value)
    this.setState(state)

    state.input.verify((result) => {
      const state = { form: {} }
      state.verify = true;

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

  }

  handleOK() {
    this.state.input.verify((result) => {
      const state = { form: {} }
      state.verify = true;

      state.error = result.error

      if (result.error === true) {
        state.form.color = "red"
        state.form.state = "Error"
      }
      else {
        state.form.color = "green"
        state.form.state = "Passed"

        this.setState(state)

        // get the current input values 
        const value = this.state.input.getValue()
        var nvalue = {}

        // rename all root value with $
        for (var key in value) nvalue['$' + key] = value[key]

        // we will save the last path in order to reconstruct the field name
        const source = this.state.initialPath.split('.')
        source.pop()
        source.push(value.key)
        const npath = source.join('.')
        delete nvalue.$key;

        // because object and array are virtualized in the builder 
        // then we need to remap the item with the correct schema underlining

        if (nvalue.$type === "Array" && nvalue.$content === "Object") {

          // recopy nestedObjects if exists
          // avoid root copy
          if (this.props.user.$_wire) {
            const no = utils.getNO(this.props.user)
            for (var a in no.nestedObject) {
              const p = no.nestedObject[a]
              nvalue[p[0]] = p[1]
            }
          }

          delete nvalue.$type;
          delete nvalue.$content;
          nvalue = [nvalue]
        }
        // normal in array
        else if (nvalue.$type === "Array" && nvalue.$content !== "Object") {
          nvalue.$type = nvalue.$content;
          delete nvalue.$content;
          nvalue = [nvalue]
        }
        // special handle for objects
        else if (nvalue.$type === "Object") {
          console.log("obj", this.props.user)

          // recopy nestedObjects if exists
          // avoid root copy
          if (this.props.user.$_wire) {
            const no = utils.getNO(this.props.user)
            for (var a in no.nestedObject) {
              const p = no.nestedObject[a]
              nvalue[p[0]] = p[1]
            }
          }

          delete nvalue.$type;
        }

        if (this.state.edition === true) {
          this.props.onOk(({
          // console.log(({
            edition: true,
            oldPath: this.state.initialPath,
            newPath: npath,
            key: value.key,
            value: nvalue
          }))
        }
        else {
          this.props.onOk(({
            edition: false,
            newPath: this.state.initialPath + "." + value.key,
            key: value.key,
            value: nvalue
          }))
        }
      }
    })

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
      onOk={this.handleOK.bind(this)}
      onCancel={onCancel}
    >
      <FieldifySchemaForm
        ref={this.formRef}
        schema={this.state.schema}
        input={this.state.input}
        user={this.props.user}
        verify={this.state.verify}
        onChange={this.formChanged.bind(this)}
      />

    </Modal>);
  }
}
