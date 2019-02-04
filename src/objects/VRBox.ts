import * as THREE from 'three'
import * as _ from 'lodash'
import * as CANNON from 'cannon'
import { VRObject, VRObjectConfig } from './VRObject'

/**
 * VR BOX CONFIG
 */
export interface VRBoxConfig extends VRObjectConfig {
	width?: number
	height?: number
	depth?: number
}

/**
 * VR BOX CLASS
 */
export class VRBox extends VRObject {
	constructor(c?: VRBoxConfig) {
		super(c)
		c = _.defaults(c || {}, {
			width: 20,
			height: 20,
			depth: 20
		})
		this.object3D.geometry = new THREE.BoxBufferGeometry(
			c.width,
			c.height,
			c.depth
		)
		this.objectCannon.addShape(
			new CANNON.Box(new CANNON.Vec3(c.width / 2, c.height / 2, c.depth / 2))
		)
	}
}
