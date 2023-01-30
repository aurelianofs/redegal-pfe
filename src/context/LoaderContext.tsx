import { createContext, useState, useContext } from 'react';

export type LoaderState = {
  isLoading: boolean,
  setIsLoading: null | React.Dispatch<React.SetStateAction<boolean>>
};

export const LoaderContext = createContext<LoaderState>({ isLoading: false, setIsLoading: null });

export const LoaderProvider = ({ children }: { children: JSX.Element }) => {
  const [ isLoading, setIsLoading ] = useState( false );

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      { children }
    </LoaderContext.Provider>
  )
};

export const useLoader = () => {
  const { setIsLoading } = useContext(LoaderContext);

  return (promise: Promise<any>) => {
    if(setIsLoading) setIsLoading(true);

    promise.then( () => {
      if(setIsLoading) setIsLoading(false);
    })

    return promise;
  }
}
