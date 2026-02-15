import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface StepContextType {
  sessionId: string | null;
  storyId: number;
  level: number;
  step: number;
  onStepCompleted?: (completionData?: any) => void;
  /** "Başla" adımlarında önce false; Başla'ya basınca true yapılır, alttaki "Sonraki adıma geç" görünsün */
  footerVisible: boolean;
  setFooterVisible: (v: boolean) => void;
}

export const StepContext = createContext<StepContextType | null>(null);

export function StepProvider({ 
  children, 
  sessionId, 
  storyId, 
  level, 
  step,
  onStepCompleted,
  initialFooterVisible = true,
}: { 
  children: ReactNode;
  sessionId: string | null;
  storyId: number;
  level: number;
  step: number;
  onStepCompleted?: (completionData?: any) => void;
  initialFooterVisible?: boolean;
}) {
  const [footerVisible, setFooterVisible] = useState(initialFooterVisible);
  useEffect(() => {
    setFooterVisible(initialFooterVisible);
  }, [level, step, initialFooterVisible]);

  return (
    <StepContext.Provider value={{ sessionId, storyId, level, step, onStepCompleted, footerVisible, setFooterVisible }}>
      {children}
    </StepContext.Provider>
  );
}

export function useStepContext() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStepContext must be used within StepProvider');
  }
  return context;
}





