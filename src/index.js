import { input } from "fieldify"

import React from 'react'
import styles from './styles.module.css'

import * as schema from './Schema'
import types from './Types'

// just map the input class from fieldify
export class Input extends input {}

// export the schema
export const Schema = schema;

// export types
export const Types = types;


