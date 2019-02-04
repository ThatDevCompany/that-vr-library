import * as THREE from 'three'
import * as _ from 'lodash'
import { VRLight, VRLightConfig } from './VRLight'

/**
 * VR POINT LIGHT CONFIG
 */
export interface VRPointLightConfig extends VRLightConfig {
	intensity?: number
	distance?: number
}

/**
 * VR POINT LIGHT CLASS
 */
export class VRPointLight extends VRLight {
	object3D: THREE.PointLight

	constructor(c?: VRPointLightConfig) {
		super()
		c = this.config = _.defaults(this.config, {
			intensity: 1,
			distance: 350
		})
		this.object3D = new THREE.PointLight(c.color, c.intensity, c.distance)
	}

	intensity(intensity: number) {
		this.config.intensity = this.object3D.intensity = intensity
		return this
	}

	distance(distance: number) {
		this.config.distance = this.object3D.distance = distance
		return this
	}
}
