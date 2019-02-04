import * as THREE from 'three'
import * as _ from 'lodash'
import * as CANNON from 'cannon'
import { IVRArticle, VRArticle, VRArticleConfig } from '@/VRArticle'

/**
 * VR LIGHT CONFIG
 */
export interface VRLightConfig extends VRArticleConfig {
	position?: THREE.Vector3
	color?: number
	castShadow?: boolean
}

/**
 * VR LIGHT INTERFACE
 */
export interface IVRLight extends IVRArticle {
	position(x: number, y: number, z: number)
	color(color: number)
	castShadow()
}

/**
 * VR LIGHT CLASS
 */
export abstract class VRLight extends VRArticle implements IVRLight {
	object3D: THREE.Light

	constructor(c?: VRLightConfig) {
		super(c)
		c = this.config = _.defaults(this.config || {}, {
			position: new THREE.Vector3(0, 0, 0),
			color: 0xffffff,
			castShadow: false
		})
	}

	position(x: number, y: number, z: number): VRLight {
		this.config.position = new THREE.Vector3(x, y, z)
		this.object3D.position.set(x, y, z)
		return this
	}

	color(color: number): VRLight {
		this.object3D.color.set(color)
		return this
	}

	castShadow(): VRLight {
		this.config.castShadow = this.object3D.castShadow = true
		return this
	}

	reset(): VRLight {
		super.reset()
		const p = this.config.position
		this.position(p.x, p.y, p.z)
		return this
	}

	addTo(world: CANNON.World, container: THREE.Object3D): VRLight {
		super.addTo(world, container)
		container.add(this.object3D)
		return this
	}
}
