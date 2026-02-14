type Listener = () => void;

export class LocaleStore {
  private listeners = new Set<Listener>();

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  notify() {
    this.listeners.forEach((l) => l());
  }
}
