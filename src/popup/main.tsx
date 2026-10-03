import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, MousePointer2, ArrowUpDown, Coffee } from 'lucide-react';
import { getSettings, saveSettings, BounceSettings, defaultSettings } from '../shared/settings';

const App = () => {
  const [settings, setSettings] = useState<BounceSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then(s => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  const updateSetting = <K extends keyof BounceSettings>(key: K, value: BounceSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (!loaded) return null;

  return (
    <>
      <div className="header">
        <img src="../../public/icons/icon48.png" alt="Logo" className="header-icon" />
        <div>
          <h1 className="header-title">Boing Web</h1>
          <p className="header-subtitle">Physics Engine Settings</p>
        </div>
      </div>
      
      <div className="content">
        <div className="toggle-row">
          <span className="toggle-label">Enable Physics</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.enabled} 
              onChange={e => updateSetting('enabled', e.target.checked)} 
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="control-group" style={{ opacity: settings.enabled ? 1 : 0.5, pointerEvents: settings.enabled ? 'auto' : 'none' }}>
          
          <div className="control-header">
            <span className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MousePointer2 size={14} /> Mouse Physics
            </span>
            <label className="switch switch-small">
              <input 
                type="checkbox" 
                checked={settings.mouseEnabled} 
                onChange={e => updateSetting('mouseEnabled', e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="control-header" style={{ marginTop: '8px', opacity: settings.mouseEnabled ? 1 : 0.5 }}>
            <span className="control-label">Intensity</span>
            <span className="control-value">{settings.intensity.toFixed(2)}x</span>
          </div>
          <input 
            type="range" 
            min="0" max="3" step="0.05" 
            value={settings.intensity} 
            onChange={e => updateSetting('intensity', parseFloat(e.target.value))} 
            disabled={!settings.mouseEnabled}
            style={{ opacity: settings.mouseEnabled ? 1 : 0.5 }}
          />

          <div className="control-header" style={{ marginTop: '16px' }}>
            <span className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={14} /> Scroll Physics
            </span>
            <label className="switch switch-small">
              <input 
                type="checkbox" 
                checked={settings.scrollEnabled} 
                onChange={e => updateSetting('scrollEnabled', e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="control-header" style={{ marginTop: '8px', opacity: settings.scrollEnabled ? 1 : 0.5 }}>
            <span className="control-label">Intensity</span>
            <span className="control-value">{settings.scrollIntensity.toFixed(2)}x</span>
          </div>
          <input 
            type="range" 
            min="0" max="3" step="0.05" 
            value={settings.scrollIntensity} 
            onChange={e => updateSetting('scrollIntensity', parseFloat(e.target.value))} 
            disabled={!settings.scrollEnabled}
            style={{ opacity: settings.scrollEnabled ? 1 : 0.5 }}
          />

          <div className="control-header" style={{ marginTop: '12px' }}>
            <span className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} /> Stiffness
            </span>
            <span className="control-value">{settings.stiffness}</span>
          </div>
          <input 
            type="range" 
            min="50" max="400" step="10" 
            value={settings.stiffness} 
            onChange={e => updateSetting('stiffness', parseInt(e.target.value))} 
          />

          <div className="control-header" style={{ marginTop: '12px' }}>
            <span className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} /> Damping
            </span>
            <span className="control-value">{settings.damping}</span>
          </div>
          <input 
            type="range" 
            min="5" max="40" step="1" 
            value={settings.damping} 
            onChange={e => updateSetting('damping', parseInt(e.target.value))} 
          />
          
        </div>
        
        <a 
          href="https://buymeacoffee.com/neelrs" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bmc-button"
        >
          
          <Coffee size={16} strokeWidth={2.5} />
          <span>Buy me a coffee</span>
        </a>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
