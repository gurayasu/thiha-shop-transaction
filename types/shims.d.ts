declare namespace React {
  type FormEvent<T = any> = any;
  function useState<T = any>(initial: T): [T, (value: T) => void];
  function useEffect(effect: (...args: any[]) => any, deps?: any[]): void;
}

declare module 'react' {
  export = React;
}

declare module 'react-dom' {
  const ReactDOM: any;
  export default ReactDOM;
}

declare module 'next' {
  export type NextApiRequest = any;
  export type NextApiResponse<T = any> = any;
}

declare module 'next/app' {
  export type AppProps = any;
  const App: any;
  export default App;
}

declare module 'next/head' {
  const Head: any;
  export default Head;
}
