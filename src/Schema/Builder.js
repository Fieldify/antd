import React from 'react';
import {
  schema,
  iterator,
  assign,
  fusion,
  utils
} from "fieldify"

import {
  notification,
  Table,
  Tag,
  Popconfirm,
  Tooltip
} from 'antd';

import {
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  UnorderedListOutlined as ObjectIcon,
  PlusOutlined as PlusIcon,
  CopyOutlined as ArrayIcon
} from '@ant-design/icons';

import { FieldifySchemaBuilderModal } from './BuilderModal';

import String from "../Types/String";

export class FieldifySchemaBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      modalUser: null,
      schemaDataSource: []
    };

    this.schema = props.schema;

    this.state.schemaDataSource = this.updateDataSource()

    this.columns = [
      {
        title: 'Key',
        dataIndex: 'name',
        key: 'key',
      },
      {
        title: 'Description',
        dataIndex: 'doc',
        key: 'doc'
      },
      {
        title: <div className="ant-radio-group ant-radio-group-outline ant-radio-group-small">
          <span className="ant-radio-button-wrapper" onClick={() => this.handlingAdd()}>
            <span>Add Field <PlusIcon /></span>
          </span>
        </div>,
        dataIndex: 'actions',
        key: 'actions',
        align: "right"
      },
    ];

  }

  fireOnChange() {

  }

  itemChanged(arg) {
    console.log("itemChanged", arg);
  }

  itemRemove(item) {
    this.props.schema.removeLineup(item.$_path);

    this.fireOnChange();

    this.setState({
      schemaDataSource: this.updateDataSource()
    });

    notification.success({
      message: "Field removed",
      description: `Field at ${item.$_path} has been removed successfully`
    })
  }

  handlingAdd(path) {
    path = path || ".";
    const lineup = this.props.schema.getLineup(path) || this.schema.handler.schema;
    console.log("handing add", path, lineup);
    this.setState({ modal: true, modalUser: lineup });
  }

  handlingEdit(item) {
    console.log("handing edit", item, Array.isArray(item));
    this.setState({ modal: true, modalContent: item });
  }

  updateDataSource() {
    const self = this;
    function fieldify2antDataTable(schema, wire) {
      if (!wire)
        wire = "";
      const current = [];
      utils.orderedRead(schema, (index, item) => {
        const path = wire + "." + item.$_key;
        item.$_path = path;

        // Is array
        if (Array.isArray(item)) {
          var composite = <Tooltip title="... of objects">
            <Tag color="#722ed1"><ObjectIcon /></Tag>
          </Tooltip>;
          // for direct type assignation
          if ("$type" in item[0]) {
            const TypeInfo = item[0].$type.Info;
            composite = <TypeInfo />;
          }
          current.push({
            ptr: item,
            key: path,
            name: <div>
              <Tooltip title="This field is an array ...">
                <Tag color="#eb2f96"><ArrayIcon /></Tag>
              </Tooltip>
              {composite}
              <strong>{item.$_key}</strong>
            </div>,
            doc: item.$doc,
            children: !("$type" in item[0]) ? fieldify2antDataTable(item[0], path) : null,
            actions: <div className="ant-radio-group ant-radio-group-outline ant-radio-group-small">
              <Popconfirm title={<span>Are you sure to delete the Array <strong>{path}</strong></span>} onConfirm={() => self.itemRemove(item)} okText="Yes" cancelText="No">
                <span className="ant-radio-button-wrapper">
                  <span><DeleteIcon /></span>
                </span>
              </Popconfirm>

              <span className="ant-radio-button-wrapper" onClick={() => self.handlingEdit(item)}>
                <span><EditIcon /></span>
              </span>

              {!("$type" in item[0]) ?
                <span className="ant-radio-button-wrapper" onClick={() => self.handlingAdd(path)}>
                  <span><PlusIcon /></span>
                </span>
                : null}
            </div>
          });
        }
        // is object
        else if (typeof item === "object" && !item.$type) {
          current.push({
            ptr: item,
            key: path,
            name: <div>
              <Tooltip title="This field is an object">
                <Tag color="#722ed1"><ObjectIcon /></Tag>
              </Tooltip>
              <strong>{item.$_key}</strong>
            </div>,
            doc: item.$doc,
            children: fieldify2antDataTable(item, path),
            actions: <div className="ant-radio-group ant-radio-group-outline ant-radio-group-small">
              <Popconfirm title={<span>Are you sure to delete Object <strong>{path}</strong></span>} onConfirm={() => self.itemRemove(item)} okText="Yes" cancelText="No">
                <span className="ant-radio-button-wrapper">
                  <span><DeleteIcon /></span>
                </span>
              </Popconfirm>

              <span className="ant-radio-button-wrapper" onClick={() => self.handlingEdit(item)}>
                <span><EditIcon /></span>
              </span>

              <span className="ant-radio-button-wrapper" onClick={() => self.handlingAdd(path)}>
                <span><PlusIcon /></span>
              </span>
            </div>
          });
        }
        else if (item.$type) {
          const TypeInfo = item.$type.Info;
          current.push({
            ptr: item,
            key: path,
            name: <div>
              <TypeInfo /> {item.$_key}
            </div>,
            doc: item.$doc,
            actions: <div className="ant-radio-group ant-radio-group-outline ant-radio-group-small">
              <Popconfirm title={<span>Are you sure to delete <strong>{path}</strong></span>} onConfirm={() => self.itemRemove(item)}
                // onCancel={cancel}
                okText="Yes" cancelText="No">
                <span className="ant-radio-button-wrapper">
                  <span><DeleteIcon /></span>
                </span>
              </Popconfirm>

              <span className="ant-radio-button-wrapper" onClick={() => self.handlingEdit(item)}>
                <span><EditIcon /></span>
              </span>
            </div>
          });
        }
      });
      return (current);
    }

    var data = null;
    if (this.schema) {
      data = fieldify2antDataTable(this.schema.tree);
      return (data)
    }

    return ([])
  }

  render() {
    const sds = this.state.schemaDataSource;

    return (<div>
      <FieldifySchemaBuilderModal
        user={this.state.modalUser}
        visible={this.state.modal}
        onCancel={() => this.setState({ modal: false })}
        onOk={this.itemChanged.bind(this)}
      />

      <Table columns={this.columns} dataSource={sds} size="small" pagination={{
        total: sds.length,
        pageSize: sds.length,
        hideOnSinglePage: true
      }} expandable={{ defaultExpandAllRows: true }} />
    </div>);
  }
}
