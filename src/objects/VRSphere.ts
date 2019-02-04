import * as THREE from 'three'
import * as _ from 'lodash'
import * as CANNON from 'cannon'
import { VRObject, VRObjectConfig } from './VRObject'

/**
 * VR SPHERE CONFIG
 */
export interface VRSphereConfig extends VRObjectConfig {
	radius?: number
	widthSegments?: number
	heightSegments?: number
}

/**
 * VR SPHERE CLASS
 */
export class VRSphere extends VRObject {
	constructor(c?: VRSphereConfig) {
		super(c)
		c = this.config = _.defaults(this.config, {
			radius: 10,
			widthSegments: 32,
			heightSegments: 32
		})

		this.object3D.geometry = new THREE.SphereBufferGeometry(
			c.radius,
			c.widthSegments,
			c.heightSegments
		)
		this.objectCannon.addShape(new CANNON.Sphere(c.radius))
	}
}
