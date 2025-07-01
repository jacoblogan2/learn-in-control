
import React, { useRef, useEffect } from 'react';

interface RenderTrackerProps {
  name: string;
  props?: any;
}

export const RenderTracker: React.FC<RenderTrackerProps> = ({ name, props }) => {
  const renderCount = useRef(0);
  const lastProps = useRef(props);

  useEffect(() => {
    renderCount.current += 1;
    
    if (props && JSON.stringify(lastProps.current) !== JSON.stringify(props)) {
      console.log(`🔄 ${name} re-rendered (#${renderCount.current}) - Props changed:`, {
        previous: lastProps.current,
        current: props
      });
      lastProps.current = props;
    } else {
      console.log(`🔄 ${name} re-rendered (#${renderCount.current}) - Same props`);
    }
  });

  // Don't render anything in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '5px', 
      fontSize: '12px',
      zIndex: 9999,
      borderRadius: '3px'
    }}>
      {name}: {renderCount.current} renders
    </div>
  );
};
