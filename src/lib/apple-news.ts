// Global & Events

declare global {
  interface GlobalEventHandlersEventMap {
    ANConfigurationChanged: ANConfigurationChangeEvent;
    ANPresentationStateChanged: ANPresentationStateChangeEvent;
  }

  interface Window {
    applenews?: {
      configuration: ANConfiguration;
      presentationState: ANPresentationState;
    };
    webkit?: {
      messageHandlers: {
        applenews: {
          postMessage: (message: ANMessage) => void;
        };
      };
    };
  }
}

// Configuration

export interface ANConfiguration {
  canvasSize: {
    width: number;
    height: number;
  };
  contentFrame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dataSources: {
    [key: string]: string;
  };
  dynamicType: string;
  locale: string;
}

export type ANConfigurationChangeEvent = CustomEvent<ANConfigurationChangeEventDetail>;

export interface ANConfigurationChangeEventDetail {
  newConfiguration: ANConfiguration;
  oldConfiguration: ANConfiguration;
}

// Presentation State

export enum ANPresentationState {
  UNKNOWN = "unknown",
  PRESENTED = "presented",
  NOT_PRESENTED = "notpresented"
}

export type ANPresentationStateChangeEvent = CustomEvent<ANPresentationStateChangeEventDetail>;

export interface ANPresentationStateChangeEventDetail {
  newPresentationState: ANPresentationState;
}

// Message

export type ANMessage =
  | {
      name: ANMessageName.PRESENTABLE;
      height: number;
    }
  | {
      name: ANMessageName.UPDATE;
      height: number;
    }
  | {
      name: ANMessageName.FAILED;
      errorCode: number;
      error: string;
    }
  | {
      name: ANMessageName.LOADING;
    };

export enum ANMessageName {
  PRESENTABLE = "presentable",
  UPDATE = "update",
  FAILED = "failed",
  LOADING = "loading"
}

// Helper Functions

export function postMessage(message: ANMessage) {
  if (window.webkit) {
    window.webkit.messageHandlers.applenews.postMessage(message);
  }
}

export function emitCanvasHeight(canvas: HTMLElement) {
  const presentationState = window.applenews
    ? window.applenews.presentationState
    : null;

  postMessage({
    name:
      presentationState === ANPresentationState.PRESENTED
        ? ANMessageName.UPDATE
        : ANMessageName.PRESENTABLE,
    height: canvas.offsetHeight
  });
}

export function renderWithinAppleNews(
  canvas: HTMLElement,
  render: (canvas: HTMLElement) => void
) {
  const configuration = window.applenews
    ? window.applenews.configuration
    : null;

  if (configuration) {
    canvas.style.width = `${configuration.canvasSize.width}px`;
  }

  try {
    render(canvas);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to render. Reason unknown.";

    return postMessage({
      name: ANMessageName.FAILED,
      errorCode: 1,
      error: errorMessage
    });
  }

  emitCanvasHeight(canvas);
}

export function initAppleNews(
  canvas: HTMLElement,
  render: (canvas: HTMLElement) => void
) {
  function update() {
    renderWithinAppleNews(canvas, render);
  }

  document.addEventListener("ANConfigurationChanged", _event => update());
  document.addEventListener("ANPresentationStateChanged", event => {
    if (event.detail.newPresentationState !== ANPresentationState.PRESENTED) {
      update();
    }
  });
  return update;
}
