export type Loadable<T> = {
  status: "init" | "loading" | "still"
  state: T
}
