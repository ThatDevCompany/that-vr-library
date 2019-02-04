import * as THREE from 'three'
import * as _ from 'lodash'
import * as CANNON from 'cannon'
import { VRObject, VRObjectConfig } from './VRObject'

/**
 * VR PLANE CONFIG
 */
export interface VRPlaneConfig extends VRObjectConfig {
	width?: number
	height?: number
}

/**
 * VR PLANE CLASS
 */
export class VRPlane extends VRObject {
	constructor(c?: VRPlaneConfig) {
		super(c)
		c = this.config = _.defaults(this.config, {
			width: 500,
			height: 500
		})
		this.object3D.geometry = new THREE.PlaneBufferGeometry(c.width, c.height)
		this.objectCannon.addShape(new CANNON.Plane())
	}
}
