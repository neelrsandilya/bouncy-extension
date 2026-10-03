import { SpringBody } from './SpringBody';

export class PhysicsWorld {
  public bodies: SpringBody[] = [];
  
  private lastTime = 0;
  private accumulator = 0;
//u can ++ or -- the value here but too high can lag ur computer
  private refresh_quantum = 1 / 120;

  public addBody(body: SpringBody) {
    this.bodies.push(body);
  }

  public clearBodies() {
    this.bodies = [];
  }
//  120 hz refresh rate simulator 
  public step(
    currentTime: number, 
    mouseVelocity: {x: number, y: number}, 
    mousePosition: {x: number, y: number},
    scrollVelocity: number,
    settings: { enabled: boolean, mouseEnabled: boolean, scrollEnabled: boolean, intensity: number, stiffness: number, damping: number, scrollIntensity: number }
  ) {
    if (!settings.enabled) return;

    if (this.lastTime === 0) {
      this.lastTime = currentTime;
      return;
    }
    
  
    if (Math.random() < 0.016) {
      this.bodies = this.bodies.filter(b => document.body.contains(b.element));
    }

    
    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    const frameTime = Math.min(dt, 0.25);
    this.accumulator += frameTime;
    
    while (this.accumulator >= this.refresh_quantum) {
      this.simulateFixedStep(this.refresh_quantum, mouseVelocity, mousePosition, scrollVelocity, settings);
      this.accumulator -= this.refresh_quantum;
    }
  }

  private simulateFixedStep(
    dt: number, 
    mouseVelocity: {x: number, y: number}, 
    mousePosition: {x: number, y: number},
    scrollVelocity: number,
    settings: { mouseEnabled: boolean, scrollEnabled: boolean, intensity: number, stiffness: number, damping: number, scrollIntensity: number }
  ) {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    for (const body of this.bodies) {
      if (body.isSleeping && Math.abs(scrollVelocity) < 1 && mouseVelocity.x === 0 && mouseVelocity.y === 0) {
        continue; 
      }

      const elementViewportCenterX = body.cachedPageX - scrollX;

      const elementViewportCenterY = body.cachedPageY - scrollY;
      

      const dx = mousePosition.x - elementViewportCenterX;
      const dy = mousePosition.y - elementViewportCenterY;
      const dist = Math.hypot(dx, dy);
      
      const influenceRadius = 300;
      let influence = 0;
      
      if (dist < influenceRadius) {
        influence = Math.max(0, 1 - dist / influenceRadius);
        influence = Math.pow(influence, 2);
      }
      
            // u can mess with the bounce intensity settings  here
//for cursor movement
      if (settings.mouseEnabled && influence > 0) {
        body.injectMomentum(
          mouseVelocity.x * influence * 0.03 * settings.intensity * dt,
          mouseVelocity.y * influence * 0.03 * settings.intensity * dt
        );
      }
//for scroll
      if (settings.scrollEnabled && Math.abs(scrollVelocity) > 0) {
        body.injectMomentum(0, scrollVelocity * 0.01 * settings.scrollIntensity * dt);
      }
      
      body.update(dt, settings);
    }
  }
}
