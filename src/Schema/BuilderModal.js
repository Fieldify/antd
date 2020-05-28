import React from 'react';
import Types from '../Types';
import { Modal, Form, Input, Select, Checkbox } from "antd";
import { FieldifySchema } from "../Schema/Schema";
import { FieldifySchemaForm } from './Form'


export class FieldifySchemaBuilderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      user: props.user,
      size: 1
    };

    this.allTypes = {}
    for (var a in Types) {
      this.allTypes[a] = Types[a].description
    }
    // create the base of the schema
    this.schema = new FieldifySchema("modal");
    this.schema.compile({
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
          items: this.allTypes
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
    });

    this.formRef = React.createRef()

    // setTimeout(()=>{
    //   if(this.formRef.current) {
    //     this.formRef.current.input({
    //       key: "yes cda"
    //     })
    //   }
    // }, 3000)
  
  }

  componentDidUpdate(props, state) {
    const newState = { ...this.state };
    var changed = false;

    if (this.state.visible !== this.props.visible) {
      newState.visible = this.props.visible;
      changed = true;
    }

    if (this.state.user !== this.props.user) {
      newState.user = this.props.user;
      changed = true;
    }

    if (changed === true)
      this.setState(newState);
  }

  // updateOptions(opts) {
  //   this.setState({
  //     ...this.state,
  //     $options: { ...opts }
  //   });
  // }

  // getTypeState(value, state) {
  //   const type = Types[value];
  //   if (type) {
  //     return ({
  //       ...this.state,
  //       ...state,
  //       $type: value,
  //       builder: null
  //     });
  //   }
  //   return ({ ...this.state, ...state, $type: value, builder: null });
  // }
  // updateType(value, state) {
  //   this.setState(this.getTypeState(value, state));
  // }

  receiveHeadForm() {
    console.log("receiveHeadForm")
  }


  render() {
    const onOk = () => {
      // this.onOk(this.state);
    };
    const onCancel = () => {
      // this.setState({ visible: false });
      this.props.onCancel(this.state);
    };
    const $name = ({ target }) => {
      this.setState({ $key: target.value });
    };
    const $required = ({ target }) => {
      this.setState({ $required: target.checked });
    };
    const $doc = ({ target }) => {
      this.setState({ $doc: target.value });
    };
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (<Modal title="Add New Field To Your Schema" width={this.state.size * 520} centered visible={this.state.visible} onOk={onOk} onCancel={onCancel}>

      <FieldifySchemaForm ref={this.formRef} schema={this.schema} user={this.props.user} onChange={this.receiveHeadForm.bind(this)} />

    </Modal>);
  }
}
