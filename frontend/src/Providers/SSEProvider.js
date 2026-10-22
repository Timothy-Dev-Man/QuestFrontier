import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import EventSource from "react-native-sse";
import { AuthContext } from "./AuthProvider";

export const SSEContext = createContext(null);

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export function SSEProvider({ children }) {

    const [es, setEs] = useState(null);
    const [connected, setConnected] = useState(false);
    const { token } = useContext(AuthContext);

    useEffect(() => {

        let cancelled = false;
        let eventSource = null;

        async function connectSSE() {
            if (!token) {
                return;
            }

            if (!BACKEND_URL) {
                return;
            }

            if (cancelled) return;

            const url = `${BACKEND_URL}/events`;

            eventSource = new EventSource(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },

                    timeout: 0,
                    pollingInterval: 5000,
                }
            );

            setEs(eventSource);

            eventSource.addEventListener(
                "open",
                () => {
                    setConnected(true);

                }
            );

            eventSource.addEventListener(
                "error",
                () => {
                    setConnected(false);

                }
            );

            eventSource.addEventListener(
                "close",
                () => {
                    setConnected(false);

                }
            );
        }

        connectSSE();

        return () => {

            cancelled = true;

            setConnected(false);

            setEs((currentEs) => {

                eventSource
                    ?.removeAllEventListeners();

                eventSource?.close();

                return currentEs === eventSource ? null : currentEs;

            });

        };

    }, [token]);

    return (
        <SSEContext.Provider
            value={{
                es,
                connected,
            }}
        >
            {children}
        </SSEContext.Provider>
    );
}