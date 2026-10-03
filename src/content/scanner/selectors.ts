export const VALID_SELECTORS = [
  'button',
  'a',
  'img',
  'video',
  'svg',
  'canvas',
  'iframe',
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="tab"]',
  'input[type="button"]',
  'input[type="submit"]',
  'article',
  'figure',
  '.card',
  '.panel',
  '.modal',
  
  'ytd-thumbnail',
  'ytd-video-renderer',
  'ytd-grid-video-renderer',
  'ytd-rich-item-renderer',
  'ytd-compact-video-renderer',
  'ytd-playlist-renderer',
  '.ytp-button',
  'ytd-button-renderer',
  'yt-icon-button',
  'yt-button-shape',
  
  '[data-testid="tweet"]',
  'article[data-testid="tweet"]',
  '[data-testid="like"]',
  '[data-testid="retweet"]',
  '[data-testid="reply"]',
  '[data-testid="UserCell"]',
  '[data-testid="tweetPhoto"]',
  '[data-testid="videoPlayer"]',
  
  'shreddit-post',
  '.Post',
  '[data-testid="post-container"]',
  'shreddit-comment',
  'button[data-click-id="upvote"]',
  'button[data-click-id="downvote"]',
  
  '[role="article"]',
  '._aacl',
  '._aaco',
  '._aagv',
  '.x1i10hfl',
  
  '.slider-item',
  '.title-card',
  '.boxart-container'
].join(',');

export const EXCLUSION_SELECTORS = [
  'html',
  'body',
  'head',
  'script',
  'style',
  'meta',
  'link',
  'header',
  'nav',
  'main',
  'footer',
  'input[type="text"]',
  'input[type="password"]',
  'textarea',
  'select'
].join(',');

export function isBlacklisted(el: HTMLElement): boolean {
  if (el.matches(EXCLUSION_SELECTORS)) return true;
  
  
  return false;
}
