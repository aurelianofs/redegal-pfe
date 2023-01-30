import { LoaderProvider } from "./LoaderContext";

const Context = ({ children }: { children: JSX.Element }) => (
  <LoaderProvider>
    { children }
  </LoaderProvider>
);

export default Context;
