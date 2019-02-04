import * as THREE from 'three'
import * as _ from 'lodash'
import * as CANNON from 'cannon'
import { IVRArticle, VRArticle, VRArticleConfig } from '@/VRArticle'

/**
 * VR OBJECT CONFIG
 */
export interface VRObjectConfig extends VRArticleConfig {
	position?: THREE.Vector3
	rotation?: THREE.Vector3
	scale?: THREE.Vector3
	color?: number
	mass?: number
	materialCannon?: CANNON.Material
	castShadow?: boolean
	receiveShadow?: boolean
}

/**
 * VR OBJECT INTERFACE
 */
export interface IVRObject extends IVRArticle {
	getObject3D(): THREE.Object3D
	getObjectCannon(): CANNON.Body
	position(x: number, y: number, z: number)
	scale(x: number, y: number, z: number)
	rotation(x: number, y: number, z: number)
	color(color: number)
	castShadow()
	receiveShadow()
}

/**
 * VR OBJECT CLASS
 */
export abstract class VRObject extends VRArticle implements IVRObject {
	protected object3D: THREE.Mesh
	protected objectCannon: CANNON.Body

	constructor(c?: VRObjectConfig) {
		super(c)
		c = this.config = _.defaults(this.config || {}, {
			position: new THREE.Vector3(0, 0, 0),
			rotation: new THREE.Vector3(0, 0, 0),
			scale: new THREE.Vector3(1, 1, 1),
			color: 0xffffff,
			castShadow: false,
			receiveShadow: false,
			mass: 2,
			materialCannon: null
		})
		this.object3D = new THREE.Mesh()
		this.object3D.material = new THREE.MeshPhongMaterial({ color: c.color })
		this.objectCannon = new CANNON.Body({ mass: c.mass })
	}

	getObject3D(): THREE.Object3D {
		return this.object3D
	}

	getObjectCannon(): CANNON.Body {
		return this.objectCannon
	}

	position(x: number, y: number, z: number): VRObject {
		this.config.position = new THREE.Vector3(x, y, z)
		this.object3D.position.set(x, y, z)
		this.objectCannon.position.set(x, y, z)
		return this
	}

	scale(x: number, y: number, z: number): VRObject {
		this.config.scale = new THREE.Vector3(x, y, z)
		// this.object3D.scale.set(x, y, z);
		return this
	}

	rotation(x: number, y: number, z: number): VRObject {
		this.config.rotation = new THREE.Vector3(x, y, z)
		this.object3D.rotation.setFromVector3(
			new THREE.Vector3(
				x * THREE.Math.DEG2RAD,
				y * THREE.Math.DEG2RAD,
				z * THREE.Math.DEG2RAD
			)
		)
		this.objectCannon.quaternion.setFromEuler(
			x * THREE.Math.DEG2RAD,
			y * THREE.Math.DEG2RAD,
			z * THREE.Math.DEG2RAD
		)
		return this
	}

	color(color: number): VRObject {
		;(<THREE.MeshPhongMaterial>this.object3D.material).color.set(color)
		return this
	}

	castShadow(): VRObject {
		this.config.castShadow = this.object3D.castShadow = true
		return this
	}

	receiveShadow(): VRObject {
		this.config.receiveShadow = this.object3D.receiveShadow = true
		return this
	}

	reset(): VRObject {
		super.reset()
		const p = this.config.position
		this.position(p.x, p.y, p.z)

		const r = this.config.rotation
		this.rotation(r.x, r.y, r.z)

		const s = this.config.scale
		this.scale(s.x, s.y, s.z)

		this.objectCannon.velocity.set(0, 0, 0)
		this.objectCannon.angularVelocity.set(0, 0, 0)

		return this
	}

	tick(): VRObject {
		this.object3D.position.set(
			this.objectCannon.position.x,
			this.objectCannon.position.y,
			this.objectCannon.position.z
		)
		this.object3D.rotation.setFromQuaternion(
			new THREE.Quaternion(
				this.objectCannon.quaternion.x,
				this.objectCannon.quaternion.y,
				this.objectCannon.quaternion.z,
				this.objectCannon.quaternion.w
			)
		)
		return this
	}

	addTo(world: CANNON.World, container: THREE.Object3D): VRObject {
		super.addTo(world, container)
		container.add(this.object3D)
		world.addBody(this.objectCannon)
		return this
	}
}
