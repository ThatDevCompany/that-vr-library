import * as CANNON from 'cannon'
import { VRConstraint, VRConstraintConfig } from './VRConstraint'

/**
 * VR POINT CONSTRAINT CLASS
 */
export class VRPointConstraint extends VRConstraint {
	protected constraint: CANNON.PointToPointConstraint

	constructor(c?: VRConstraintConfig) {
		super(c)
		this.constraint = new CANNON.PointToPointConstraint(
			this.config.objectA.getObjectCannon(),
			new CANNON.Vec3(0, 0, 0),
			this.config.objectB ? this.config.objectB.getObjectCannon() : null,
			new CANNON.Vec3(0, 0, 0)
		)
	}
}
