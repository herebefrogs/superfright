/**
 * Motion-Tracker
 *
 * Purpose: This component keeps track whether the entity it's applied to
 * is changing position or rotation by comparing the previous tick's values
 * to the current values.
 *
 * Use-Case: Typically applied to the a-camera primitive or entities with hand-controls component
 * to detect whether the player is moving their body, head or hands/controllers.
 *
 * Side-effect: add 'player-moving' state on its entity if motion is detected, or removes it if static.
 */

POSITION_MIN_MOTION = 0.0000001;
POSITION_MAX_MOTION = 0.00001;
ROTATION_MIN_MOTION = 0.000001;
ROTATION_MAX_MOTION = 0.001;

const lerp = (x, min, max) => THREE.MathUtils.mapLinear(THREE.MathUtils.clamp(x, min, max), min, max, 0, 1);

function vector3FromEuler(rot) {
  return new THREE.Vector3(rot.x, rot.y, rot.z);
}

AFRAME.registerComponent('motion-tracker', {
  init: function() {
    // cache initial position and rotation
    this.prevPos = this.el.object3D.position.clone();
    this.prevRot = vector3FromEuler(this.el.object3D.rotation);
  },
  tick: function() {
    const currRot = vector3FromEuler(this.el.object3D.rotation);
    const deltaR = this.prevRot.distanceToSquared(currRot);
    const deltaP = this.prevPos.distanceToSquared(this.el.object3D.position);

    this.slowMotion = Math.max(
      lerp(deltaP, POSITION_MIN_MOTION, POSITION_MAX_MOTION),
      lerp(deltaR, ROTATION_MIN_MOTION, ROTATION_MAX_MOTION),
    );

    this.prevRot = currRot;
    this.prevPos = this.el.object3D.position.clone();
  }
})