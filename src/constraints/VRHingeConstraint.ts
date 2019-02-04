import * as THREE from 'three'
import * as CANNON from 'cannon'
import * as _ from 'lodash'
import { VRConstraint, VRConstraintConfig } from './VRConstraint'

/**
 * VR HINGE CONSTRAINT CONFIG
 */
export interface VRHingeConstraintConfig extends VRConstraintConfig {
	pivotA: THREE.Vector3
	axisA: THREE.Vector3
	pivotB: THREE.Vector3
	axisB: THREE.Vector3
	motor?: {
		enabled: boolean
		speed?: number
		maxForce?: number
	}
	spring?: {
		enabled: boolean
		restLength?: number
		stiffness?: number
		damping?: number
		localAnchorA?: THREE.Vector3
		localAnchorB?: THREE.Vector3
	}
}

/**
 * VR HINGE CONSTRAINT CLASS
 */
export class VRHingeConstraint extends VRConstraint {
	protected constraint: CANNON.HingeConstraint

	constructor(c?: VRHingeConstraintConfig) {
		super(c)
		c = this.config = _.defaultsDeep(this.config || {}, {
			motor: {
				enabled: false,
				speed: 10,
				maxForce: 10
			},
			spring: {
				enabled: false,
				restLength: 0,
				stiffness: 1500,
				damping: 1,
				localAnchorA: new THREE.Vector3(0, 0, 0),
				localAnchorB: new THREE.Vector3(0, 0, 0)
			}
		})
		if (this.config.objectB) {
			this.constraint = new CANNON.HingeConstraint(
				this.config.objectA.getObjectCannon(),
				this.config.objectB.getObjectCannon(),
				{
					pivotA: new CANNON.Vec3(c.pivotA.x, c.pivotA.y, c.pivotA.z),
					axisA: new CANNON.Vec3(c.axisA.x, c.axisA.y, c.axisA.z),
					pivotB: new CANNON.Vec3(c.pivotB.x, c.pivotB.y, c.pivotB.z),
					axisB: new CANNON.Vec3(c.axisB.x, c.axisB.y, c.axisB.z)
				}
			)
			if (this.config.motor.enabled) {
				this.constraint.enableMotor()
				this.constraint.setMotorSpeed(this.config.motor.speed)
				this.constraint.setMotorMaxForce(this.config.motor.maxForce)
			}
			if (this.config.spring.enabled) {
				this.spring = new CANNON.Spring(
					this.config.objectA.getObjectCannon(),
					this.config.objectB.getObjectCannon(),
					this.config.spring
				)
			}
		}
	}
}
