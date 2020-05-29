
import { types, input as FieldifyInput } from 'fieldify'

import React from 'react';

import {
  Table,
  Form,
  Input,
  Tag,
  Modal,
  Alert,
  Row
} from "antd";

import {
  SmallDashOutlined as Icon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  UnorderedListOutlined as ObjectIcon,
  PlusOutlined as PlusIcon,
  CopyOutlined as ArrayIcon
} from '@ant-design/icons';

import TypeForm from '../lib/TypeForm';
import TypeInfo from '../lib/TypeInfo';
import TypeBuilder from '../lib/TypeBuilder';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Rendering of the field in a form
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class KVForm extends TypeForm {

  constructor(props) {
    super(props)
  }

  cycle(props) {
    const ret = super.cycle(props)

    if (!ret.value) ret.value = {}

    this.result = { ...ret.value }

    ret.modal = false
    ret.modalCurrent = {
      key: "",
      value: ""
    }
    ret.dataTree = { ...ret.value }
    ret.dataSource = this.computeDataSource(ret.dataTree);

    return (ret)
  }

  computeDataSource(tree) {
    const ds = []
    for (let key in tree) {
      const value = tree[key]
      ds.push({
        key: key,
        value: value,
        actions: <div className="ant-radio-group ant-radio-group-outline ant-radio-group-small">
          <span className="ant-radio-button-wrapper" onClick={() => this.removeKey(key)}>
            <span><DeleteIcon /></span>
          </span>
          <span className="ant-radio-button-wrapper" onClick={() => this.openModal({ key, value })}>
            <span><EditIcon /></span>
          </span>
        </div>
      })
    }
    return (ds)
  }

  handleModalChange(key, value) {
    const modalCurrent = { ...this.state.modalCurrent }
    modalCurrent[key] = value;
    this.setState({ modalCurrent })
  }

  openModal(data) {
    const state = {
      modalError: false,
      modalInitial: null,
      modalCurrent: data || {
        key: "",
        value: ""
      },
      modal: true
    }

    if (data) state.modalInitial = { ...state.modalCurrent }

    this.setState(state)
  }

  removeKey(key) {
    const state = { ...this.state }
    delete state.dataTree[key]
    state.dataSource = this.computeDataSource(state.dataTree);
    this.setState(state)

    this.changeValue(state.dataTree)
  }

  editedButton() {
    const state = { ...this.state }

    const mc = this.state.modalCurrent;

    // check the key input
    const type = this.schema.$_type;

    // verify the input
    const data = {}
    data[mc.key] = mc.value;
    type.verify(data, (error, message) => {
      state.modalError = error;
      state.modalErrorMessage = message;

      if (error === false) {
        // remove old entry and add new one
        if (state.modalInitial) {
          delete state.dataTree[state.modalInitial.key];
        }
        state.dataTree[state.modalCurrent.key] = state.modalCurrent.value

        state.dataSource = this.computeDataSource(state.dataTree);

        state.modal = false;
      }

      this.setState(state)
      this.changeValue(state.dataTree)
    })

  }

  render() {
    const onCancel = () => {
      this.setState({ modal: false });
    };

    const columns = [
      {
        title: 'Key',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: <div className="ant-radio-group ant-radio-group-outline ant-radio-group-small">
          <span className="ant-radio-button-wrapper" onClick={() => this.openModal()}>
            <span>Add <PlusIcon /></span>
          </span>
        </div>,
        dataIndex: 'actions',
        key: 'actions',
        align: "right"
      },
    ];

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (super.render(<div>
      <Modal
        centered
        closable={false}
        visible={this.state.modal}
        width={300}
        onOk={this.editedButton.bind(this)}
        onCancel={onCancel}
      >
        {this.state.modalError === true ?
          <div style={{ marginBottom: 8 }}>
            <Alert size="small" message={this.state.modalErrorMessage} type="error" />
          </div>

          : null}

        <Form
          {...layout}
        >
          <Form.Item label="Key">
            <Input value={this.state.modalCurrent.key} onChange={({ target }) => this.handleModalChange("key", target.value)} />
          </Form.Item>

          <Form.Item label="Value">
            <Input value={this.state.modalCurrent.value} onChange={({ target }) => this.handleModalChange("value", target.value)} />
          </Form.Item>

        </Form>


      </Modal>
      <Table
        size="small"
        dataSource={this.state.dataSource}
        columns={columns}
        pagination={{
          total: this.state.dataSource.length,
          pageSize: this.state.dataSource.length,
          hideOnSinglePage: true
        }}
      />
    </div>));
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Information of the field show fancy information of the type
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class KVInfo extends TypeInfo {
  render() {
    return (
      <span>
        <Tag color="#22075e"><Icon /></Tag>
      </span>
    )
  }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Field builder
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class KVBuilder extends TypeBuilder {
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
      </div>
    )
  }
}

export default {
  code: types.KV.code,
  description: types.KV.description,
  class: types.KV.class,

  Info: KVInfo,
  Builder: KVBuilder,
  Form: KVForm
}


