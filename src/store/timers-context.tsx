import { createContext, useContext, useReducer } from "react";

export type Timer = {
    name: string;
    duration: number;
};

type TimersState = {
    isRunning: boolean;
    timers: Timer[];
};

const initialState: TimersState = {
    isRunning: true,
    timers: []
};

type TimersContextValue = TimersState & {
    addTimer: (timerData: Timer) => void,
    startTimers: () => void,
    stopTimers: () => void,
}

const TimersContext = createContext<TimersContextValue | null>(null);

export function useTimersContext() {
    const ctx = useContext(TimersContext);
    if (!ctx) {
        throw new Error("useTimersContext must be used within a TimersContextProvider");
    }
    return ctx;
}

type TimersContextProviderProps = {
    children: React.ReactNode;
};

type StartTimersAction = {
    type: 'START_TIMERS';
};

type StopTimersAction = {
    type: 'STOP_TIMERS';
};

type AddTimerAction = {
    type: 'ADD_TIMER';
    payload: Timer;
};

type Action = StartTimersAction | StopTimersAction | AddTimerAction;

function timersReducer(state: TimersState, action: Action): TimersState {
    switch (action.type) {
        case "ADD_TIMER":
            return {
                ...state,
                timers: [
                    ...state.timers,
                    {
                        name: action.payload.name,
                        duration: action.payload.duration
                    }
                ]
            };
        case "START_TIMERS":
            return {
                ...state,
                isRunning: true
            };
        case "STOP_TIMERS":
            return {
                ...state,
                isRunning: false
            };
        default:
            return state;
    }
}

export default function TimersContextProvider({ children }: TimersContextProviderProps) {
    const [timersState, dispatch] = useReducer(timersReducer, initialState);
    const ctx: TimersContextValue = {
        timers: timersState.timers,
        isRunning: timersState.isRunning,
        addTimer: (timerData) => {
            dispatch({ type: "ADD_TIMER", payload: timerData });
        },
        startTimers: () => {
            dispatch({ type: "START_TIMERS" });
        },
        stopTimers: () => {
            dispatch({ type: "STOP_TIMERS" });
        },
    };
    return (
        <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
    );
}

//  Here we define the  Timer  and  TimersState  types. The  Timer  type represents a single timer, and the  TimersState  type represents the state of the timers. We also define the  TimersContextValue  type that extends the  TimersState  type and adds three functions:  addTimer ,  startTimers , and  stopTimers .
//  We then create a context using the  createContext  function from React. We pass the  TimersContextValue  type as a generic argument to the  createContext  function to define the type of the context value.
//  Now let's create the context provider component.
//  Create the Context Provider Component
//  Create a new file named  TimersProvider.tsx  inside the  src/store  directory and add the following code:
