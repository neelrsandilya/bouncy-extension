export class SpringBody {
  public element: HTMLElement;
  
  // verlet positions
  public position = { x: 0, y: 0 };
  public prevPosition = { x: 0, y: 0 };
  
  //  rotation
  public rotation = 0;
  public prevRotation = 0;
  
  // scale 
  public scale = 1.0;
  public prevScale = 1.0;
  public isPressed = false;
  
  public initialTransform = '';
  
  public mass: number;
  public stiffness: number;
  public damping: number;
  public rotationStiffness: number;
  public rotationDamping: number;

  // caching  page coords
  public cachedPageX = 0;
  public cachedPageY = 0;

  // sleep state 
  public isSleeping = false;

  constructor(element: HTMLElement) {
    this.element = element;
    //spcl fix inline elements
    const style = window.getComputedStyle(element);
    if (style.display === 'inline') {
      element.style.display = 'inline-block';
    }
    
    this.mass = 1.0;
    this.stiffness = 150;
    this.damping = 15;
    this.rotationStiffness = 200;
    this.rotationDamping = 18;
  }

  public wakeUp() {
    this.isSleeping = false;
  }

  public injectMomentum(vx: number, vy: number) {
    this.prevPosition.x -= vx;
    this.prevPosition.y -= vy;
    this.wakeUp();
  }

  update(dt: number, settings: { stiffness: number, damping: number }) {
    if (this.isSleeping) return;

    const k = (this.stiffness / 150) * settings.stiffness;
    const c = (this.damping / 15) * settings.damping;

    // x axis tighterrr
    const kX = k * 3.0; 
    const cX = c * 2.5; 
    
//y axis looserr
    const kY = k * 0.7;
    const cY = c * 0.6;

    const frictionX = Math.max(0, 1 - (cX / this.mass) * dt);
    const frictionY = Math.max(0, 1 - (cY / this.mass) * dt);

//position stuff
//     
const springForceX = -kX * this.position.x;
    const springForceY = -kY * this.position.y;
    
    const ax = springForceX / this.mass;
    const ay = springForceY / this.mass;

    const vx = (this.position.x - this.prevPosition.x) * frictionX;
    const vy = (this.position.y - this.prevPosition.y) * frictionY;

    this.prevPosition.x = this.position.x;
    this.prevPosition.y = this.position.y;

    this.position.x += vx + ax * dt * dt;
    this.position.y += vy + ay * dt * dt;
    
//rotation stuff
    // simulate pendulum anchored at the top ,moving left (negative vx) swings mass right (positive angle)
    const currentVelocityX = (this.position.x - this.prevPosition.x) / dt;
    const targetRotation = -currentVelocityX * 0.06;
    
    const rotationFriction = Math.max(0, 1 - (this.rotationDamping / this.mass) * dt);
    const rotationForce = -this.rotationStiffness * (this.rotation - targetRotation);
    const angularAccel = rotationForce / this.mass;
    
    const angularVelocity = (this.rotation - this.prevRotation) * rotationFriction;
    
    this.prevRotation = this.rotation;
    this.rotation += angularVelocity + angularAccel * dt * dt;

//scale stuff
    const targetScale = this.isPressed ? 0.9 : 1.0;
    const scaleK = k * 1.5; 
    const scaleC = c * 0.8;
    const scaleFriction = Math.max(0, 1 - (scaleC / this.mass) * dt);
    
    const scaleForce = -scaleK * (this.scale - targetScale);
    const scaleAccel = scaleForce / this.mass;
    
    const scaleVel = (this.scale - this.prevScale) * scaleFriction;
    
    this.prevScale = this.scale;
    this.scale += scaleVel + scaleAccel * dt * dt;

//sleep detect it
    const sleepThreshold = 0.05;
    if (
      !this.isPressed &&
      Math.abs(this.position.x - this.prevPosition.x) < sleepThreshold * dt &&
      Math.abs(this.position.y - this.prevPosition.y) < sleepThreshold * dt &&
      Math.abs(this.position.x) < sleepThreshold &&
      Math.abs(this.position.y) < sleepThreshold &&
      Math.abs(this.rotation - this.prevRotation) < sleepThreshold * dt &&
      Math.abs(this.rotation) < sleepThreshold &&
      Math.abs(this.scale - this.prevScale) < sleepThreshold * dt &&
      Math.abs(this.scale - 1.0) < 0.005
    ) {
      this.position.x = 0;
      this.position.y = 0;
      this.prevPosition.x = 0;
      this.prevPosition.y = 0;
      this.rotation = 0;
      this.prevRotation = 0;
      this.scale = 1.0;
      this.prevScale = 1.0;
      this.isSleeping = true;
    }
  }
}
