import React from "react";
import { Application } from "@/lib/witmotion/Application";

const ReactContext = React.createContext(
  undefined as ApplicationContext | undefined
);

export interface ApplicationContext {
  application: Application;
}

export interface ApplicationProviderProps {
  children: React.ReactNode;
  application: Application;
}

export function ApplicationProvider({
  children,
  application,
}: ApplicationProviderProps) {
  const context: ApplicationContext = { application };

  return (
    <ReactContext.Provider value={context}>{children}</ReactContext.Provider>
  );
}

export function useApplicationContext(): ApplicationContext {
  return React.useContext(ReactContext) as ApplicationContext;
}

export function useApplication(): Application {
  return useApplicationContext().application;
}
