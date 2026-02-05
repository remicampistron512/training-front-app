// flash.model.ts
export type BootstrapAlertType = 'success' | 'danger' | 'info' | 'warning' | 'primary' | 'secondary' | 'light' | 'dark';

export type Flash<TPayload = unknown> = {
  id: string;
  type: BootstrapAlertType;
  text: string;
  payload?: TPayload;

  dismissible?: boolean; // default true
  timeoutMs?: number;    // default 0 (no auto-dismiss)
};
