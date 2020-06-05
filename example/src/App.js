import React from 'react'
import { Schema, Input } from '@fieldify/antd'

import '@fieldify/antd/dist/index.css'

const {
  FieldifySchemaRender
} = Schema

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      layout: "vertical",
      schema: {
        name: {
          $doc: "Civility",
          $type: "Name",
          $position: 1
        }
      },

      // pre filled form
      input: {
        name: {
          first: "michael",
          last: "Vergoz"
        }
      }
    }
  }

  render() {
    return <div style={{ width: "100%" }}>
      <FieldifySchemaRender schema={this.state.schema} input={this.state.input} layout={this.state.layout} />
    </div>
  }
}