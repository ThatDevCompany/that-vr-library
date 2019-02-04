import * as THREE from 'three'
import * as CANNON from 'cannon'
import { VRPlane, VRBox, VRSphere } from './objects'
import { VRPointLight } from './lights'
import { VRHingeConstraint, VRConstraint } from './constraints'
import { VRArticle } from './VRArticle'

export interface VRWorldConfig {
	elevation?: number
	rotation?: number
	timespeed?: number
	objects: Array<VRArticle>
	constraints: Array<VRConstraint>
}

export class VRWorld {
	private _elevation: number = 50
	get elevation(): number {
		return this._elevation
	}
	set elevation(v: number) {
		this._elevation = v
		this.positionCamera()
		this.render()
	}

	private _rotation: number = 0
	get rotation(): number {
		return this._rotation
	}
	set rotation(v: number) {
		this._rotation = v
		this.positionCamera()
		this.render()
	}

	private _timespeed: number = 0
	get timespeed(): number {
		return this._timespeed
	}
	set timespeed(v: number) {
		this._timespeed = v
	}

	private _ticking = false
	private _scene: THREE.Scene
	private _container: THREE.Object3D
	private _world: CANNON.World
	private _camera: THREE.Camera
	private _renderers: Array<THREE.Renderer> = []

	constructor(private config: VRWorldConfig) {
		// Initialise Scene
		this._scene = new THREE.Scene()
		this._world = new CANNON.World()
		this._world.gravity.set(0, -200, 0)

		// Add Camera
		this._camera = new THREE.PerspectiveCamera(50, 1, 1, 1000)
		this._scene.add(this._camera)

		// Add Object Container
		this._container = new THREE.Object3D()
		this._scene.add(this._container)

		// Add Objects
		config.objects.forEach(object => {
			object.addTo(this._world, this._container)
		})

		// Add Constraints
		config.constraints.forEach(constraint => {
			constraint.addTo(this._world)
		})

		this.elevation = config.elevation || this.elevation
		this.rotation = config.rotation || this.rotation
		this.timespeed = config.timespeed || this.timespeed

		// Render
		this.render()
	}

	destroy() {}

	reset() {
		this.config.objects.forEach(object => object.reset())
		this.config.constraints.forEach(constraint => constraint.reset())
	}

	addRenderer(renderer: THREE.Renderer) {
		this._renderers.push(renderer)
		this.render()
	}

	tick({ diff }) {
		if (this._ticking) {
			return
		}
		this._ticking = true
		const v = (diff || 1) / 100
		requestAnimationFrame(() => {
			this.positionCamera()
			this._world.step(1 / 20, v, 3)
			this.config.objects.forEach(object => object.tick())
			this.render()
			this._ticking = false
		})
	}

	private positionCamera() {
		this._camera.position.set(0, this._elevation, 300)
		this._container.rotation.setFromVector3(
			new THREE.Vector3(0, this._rotation * THREE.Math.DEG2RAD, 0)
		)
		this._camera.lookAt(new THREE.Vector3(0, 5, 0))
	}

	private render() {
		this._renderers.forEach(renderer => {
			renderer.render(this._scene, this._camera)
		})
	}
}
