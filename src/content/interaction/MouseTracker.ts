export class MouseTracker {
  public position = { x: 0, y: 0 };
  public velocity = { x: 0, y: 0 };
  
  private lastPosition = { x: 0, y: 0 };
  private lastTime = 0;

  constructor() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onMouseMove(e: MouseEvent) {
    this.position.x = e.clientX;
    this.position.y = e.clientY;
  }

  public update(currentTime: number) {
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
      this.lastPosition.x = this.position.x;
      this.lastPosition.y = this.position.y;
      return;
    }


    const dt = (currentTime - this.lastTime) / 1000;
    if (dt <= 0) return;


    
    // raw velocity
    const vx = (this.position.x - this.lastPosition.x) / dt;
    const vy = (this.position.y - this.lastPosition.y) / dt;
    
    // smoothen the velocity slightly
    this.velocity.x = this.velocity.x * 0.5 + vx * 0.5;
    this.velocity.y = this.velocity.y * 0.5 + vy * 0.5;

    this.lastPosition.x = this.position.x;
    this.lastPosition.y = this.position.y;
    this.lastTime = currentTime;
  }
}
