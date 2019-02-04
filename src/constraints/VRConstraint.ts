import * as THREE from 'three'
import * as CANNON from 'cannon'
import * as _ from 'lodash'
import { VRArticle, VRArticleConfig, IVRArticle } from '../VRArticle'

/**
 * VR CONSTRAINT CONFIG
 */
export interface VRConstraintConfig extends VRArticleConfig {
	objectA: VRArticle
	objectB: VRArticle
}

/**
 * VR CONSTRAINT CLASS
 */
export abstract class VRConstraint {
	protected config
	protected constraint: CANNON.Constraint
	protected spring: CANNON.Spring

	constructor(c?: VRConstraintConfig) {
		this.config = <VRConstraintConfig>_.defaults(c || {}, {})
	}

	addTo(world: CANNON.World): VRConstraint {
		if (this.constraint) {
			world.addConstraint(this.constraint)
		}
		if (this.spring) {
			world.addEventListener('postStep', () => {
				this.spring.applyForce()
			})
		}
		return this
	}

	reset() {}
}
