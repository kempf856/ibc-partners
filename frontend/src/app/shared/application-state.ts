export enum ApplicationState {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED'
}

export const APPLICATION_STATE_LABELS: Record<ApplicationState, string> = {
  [ApplicationState.CREATED]: 'Beérkezett',
  [ApplicationState.IN_PROGRESS]: 'Feldolgozás alatt',
  [ApplicationState.ACCEPTED]: 'Elfogadva',
  [ApplicationState.DENIED]: 'Visszautasítva',
};

export function applicationStateLabel(applicationState?: ApplicationState): string {
  if (!applicationState) return '';
  return APPLICATION_STATE_LABELS[applicationState];
}

export const APPLICATION_STATE_CLASSES: Record<ApplicationState, string> = {
  [ApplicationState.CREATED]: 'status-new',
  [ApplicationState.IN_PROGRESS]: 'status-pending-1',
  [ApplicationState.ACCEPTED]: 'status-success',
  [ApplicationState.DENIED]: 'status-error',
};

export function applicationStateClass(applicationState?: ApplicationState): string {
  if (!applicationState) return '';
  return APPLICATION_STATE_CLASSES[applicationState];
}
