export class ScrollTracker {
  public velocity = 0;
  
  private lastScrollY = 0;
  private lastTime = 0;

  constructor() {
    this.lastScrollY = window.scrollY;
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
  }

  private onScroll() {
  }

  public update(currentTime: number) {
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
      this.lastScrollY = window.scrollY;
      return;
    }

    const dt = (currentTime - this.lastTime) / 1000;
    if (dt <= 0) return;

    const currentScrollY = window.scrollY;
    
    //vertical velocity
    const vy = (currentScrollY - this.lastScrollY) / dt;
    
    // smoothen velocity
    this.velocity = this.velocity * 0.7 + vy * 0.3;

    this.lastScrollY = currentScrollY;
    this.lastTime = currentTime;
    
    if (Math.abs(this.velocity) < 50) {
      this.velocity = 0;
    }
  }
}
