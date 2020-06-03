import React from 'react';
import RecycledComponent from 'react-recycling';

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

export class FieldifySchemaBuilder extends RecycledComponent {

  cycle(props, first) {
    const state = {
      modal: false,
      modalUser: null,
      schemaDataSource: []
    };

    this.onChange = ()=>{}
    if(props.onChange) this.onChange = props.onChange

    this.schema = props.schema;

    state.schemaDataSource = this.updateDataSource()

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
            <span>Add <PlusIcon /></span>
          </span>
        </div>,
        dataIndex: 'actions',
        key: 'actions',
        align: "right"
      },
    ];

    return(state)
  }

  fireOnChange() {
    const ex = this.schema.export()
    this.schema.compile(ex)

    // fire on change for exporting the new schema
    this.onChange(ex)
  }

  itemChanged(arg) {
    if (arg.edition === true) {
      const lineup = this.props.schema.getLineup(arg.oldPath);

      // delete org
      this.props.schema.removeLineup(arg.oldPath)

      // put new
      this.props.schema.setLineup(arg.newPath, arg.value)

      notification.success({
        message: "Field updated",
        description: `Field at ${arg.oldPath} has been successfully updated`
      })
    }

    // manage addition
    else {
      // just put the new one
      this.props.schema.setLineup(arg.newPath, arg.value)

      notification.success({
        message: "Field added",
        description: `Field at ${arg.newPath} has been successfully added`
      })
    }

    this.fireOnChange();

    this.setState({
      modal: false,
      modalContent: null,
      modalUser: null,
      schemaDataSource: this.updateDataSource()
    });
  }

  itemRemove(item) {
    this.props.schema.removeLineup(item.$_wire);

    this.fireOnChange();

    this.setState({
      schemaDataSource: this.updateDataSource()
    });

    notification.success({
      message: "Field removed",
      description: `Field at ${item.$_wire} has been successfully removed`
    })
  }

  handlingAdd(path) {
    path = path || ".";

    const lineup = this.props.schema.getLineup(path) || this.schema.handler.schema;

    const state = {
      modal: true, 
      modalContent: null, 
      modalUser: lineup
    }

    this.setState(state);
  }

  handlingEdit(item) {
    const path = item.$_wire || ".";

    const lineup = this.props.schema.getLineup(path) || this.schema.handler.schema;

    const state = {
      modal: true, 
      modalContent: item, 
      modalUser: lineup
    }

    this.setState(state);
  }

  updateDataSource() {
    const self = this;
    function fieldify2antDataTable(schema, wire) {
      if (!wire)
        wire = "";
      const current = [];
      utils.orderedRead(schema, (index, item) => {
        var path = wire + "." + item.$_key;
        item.$_path = path;

        // Is array
        if (Array.isArray(item)) {
          path = wire + "." + item[0].$_key;
          item[0].$_path = path;

          var composite = <Tooltip title="... of objects">
            <Tag color="#722ed1"><ObjectIcon /></Tag>
          </Tooltip>;
          // for direct type assignation
          if ("$type" in item[0]) {
            const TypeInfo = item[0].$type.Info;
            composite = <TypeInfo />;
          }
          current.push({
            ptr: item[0],
            key: path,
            name: <div>
              <Tooltip title="This field is an array ...">
                <Tag color="#eb2f96"><ArrayIcon /></Tag>
              </Tooltip>
              {composite}
              <strong>{item[0].$_key}</strong>
            </div>,
            doc: item[0].$doc,
            children: !("$type" in item[0]) ? fieldify2antDataTable(item[0], path) : null,
            actions: <div className="ant-radio-group ant-radio-group-outline ant-radio-group-small">
              <Popconfirm title={<span>Are you sure to delete the Array <strong>{path}</strong></span>} onConfirm={() => self.itemRemove(item[0])} okText="Yes" cancelText="No">
                <span className="ant-radio-button-wrapper">
                  <span><DeleteIcon /></span>
                </span>
              </Popconfirm>

              <span className="ant-radio-button-wrapper" onClick={() => self.handlingEdit(item[0])}>
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
      data = fieldify2antDataTable(this.schema.handler.schema);
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
        value={this.state.modalContent}
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
