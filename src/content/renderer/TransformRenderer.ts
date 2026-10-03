import { SpringBody } from '../physics/SpringBody';

export class TransformRenderer {
  public render(bodies: SpringBody[]) {
    for (const body of bodies) {
      if (body.isSleeping) {
        body.element.style.willChange = 'auto';
        continue;
      } else {
        body.element.style.willChange = 'transform';
      }

      const vx = (body.position.x - body.prevPosition.x) * 120;
      const vy = (body.position.y - body.prevPosition.y) * 120;

      const speed = Math.hypot(vx, vy);
      
      const velocityStretch = 1 + Math.min(speed * 0.0004, 0.20);
      const velocitySquash = 1 / velocityStretch;

      //deformation 
      const stretch = velocityStretch * body.scale;
      const squash = velocitySquash * body.scale;

      const tx = body.position.x.toFixed(2);
      const ty = body.position.y.toFixed(2);
      const rot = body.rotation.toFixed(2);

      //bounce angle
      let angle = 0;
      if (speed > 5) {
        angle = Math.atan2(vy, vx) * (180 / Math.PI);
      }

      const base = body.initialTransform ? `${body.initialTransform} ` : '';
// final css transform string
      body.element.style.transform = `${base}translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) rotate(${angle}deg) scaleX(${stretch}) scaleY(${squash}) rotate(${-angle}deg)`;
    }
  }
}
