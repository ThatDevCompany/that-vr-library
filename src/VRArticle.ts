import * as THREE from 'three'
import * as CANNON from 'cannon'

/**
 * VR ARTICLE CONFIG
 */
export interface VRArticleConfig {
	name?: string
}

/**
 * VR ARTICLE INTERFACE
 */
export interface IVRArticle {
	name: string
	reset()
	tick()
	addTo(world: CANNON.World, container: THREE.Object3D)
}

/**
 * VR ARTICLE CLASS
 */
export abstract class VRArticle implements IVRArticle {
	protected config

	constructor(c?: VRArticleConfig) {
		this.config = c || {
			name: 'Unnamed'
		}
	}

	get name(): string {
		return this.config.name
	}

	tick(): VRArticle {
		return this
	}

	reset(): VRArticle {
		return this
	}

	addTo(world: CANNON.World, scene: THREE.Object3D): VRArticle {
		return this
	}
}
