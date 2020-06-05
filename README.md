# @fieldify/antd

> Rendering Fieldify Types Using Ant Design Framework

[![NPM](https://img.shields.io/npm/v/@fieldify/antd.svg)](https://www.npmjs.com/package/@fieldify/antd) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This project aims to bridge [Fieldify](https://github.com/mykiimike/fieldify) native capabilities to ReactJS using the [Antd Framework](https://ant.design/) to render the fields.

See example on https://fieldify.github.io/antd/

## Install

Using NPM

```bash
npm install --save @fieldify/antd
```

Using Yarn

```bash
yarn add @fieldify/antd
```

## Usage

### Setup a Fieldify builder

```jsx

import React from 'react'
import { Schema, Input } from '@fieldify/antd'

import '@fieldify/antd/dist/index.css'

const {
  FieldifySchemaBuilder
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
      }
    }
  }

  builderChanged(schema) {
    console.log("Schema changes")
  }

  render() {
    return <div style={{ width: "100%" }}>
      <FieldifySchemaBuilder schema={this.state.schema} onChange={this.builderChanged.bind(this)} />
    </div>
  }
}
```

### Rendering Fieldify form

```jsx
import React from 'react'
import { Schema, Input } from '@fieldify/antd'

import '@fieldify/antd/dist/index.css'

const {
  FieldifySchemaForm
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
          first: "michael"
        }
      }
    }
  }

  formChanged(input, value) {
    // run the verifier on each change
    input.verify((result) => {
      const state = {
        input: { ...result.result },
      }

      if (result.error === true) {
        // form verification failed
      }
      else {
        // form verification success
      }

      this.setState(state)
    })
  }

  render() {
    const style = { padding: '8px' };

    return <div style={{ width: "100%" }}>
      <FieldifySchemaForm schema={this.state.schema} input={this.state.input} layout={this.state.layout} onChange={this.formChanged.bind(this)} />
    </div>
  }
}
```

### Rendering form data


```jsx
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
```

## Support

This package is actually mainly maintain by Michael Vergoz, but the project is a base of Signderiva, a swiss based company specialized in Digital Proof.

![Design of the Schema](data/logo-pulse.png =100x)

Thanks to Pulse.digital, a swiss based company, for helping us 

Of course, thanks to all contributors

## License

GPL-3.0 © [](https://github.com/)
