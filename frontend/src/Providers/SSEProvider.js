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

            console.log("========== SSE START ==========");

            console.log(
                "SSE BACKEND URL:",
                BACKEND_URL
            );

            console.log(
                "SSE TOKEN EXISTS:",
                !!token
            );

            if (!token) {
                console.log("SSE: NO TOKEN");
                return;
            }

            if (!BACKEND_URL) {
                console.log(
                    "SSE: BACKEND URL IS UNDEFINED"
                );

                return;
            }

            if (cancelled) return;

            const url = `${BACKEND_URL}/events`;

            console.log(
                "SSE CONNECTING TO:",
                url
            );

            eventSource = new EventSource(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },

                    timeout: 0,
                    pollingInterval: 5000,
                    debug: true,
                }
            );

            setEs(eventSource);

            eventSource.addEventListener(
                "open",
                () => {

                    console.log("✅ SSE OPEN");

                    setConnected(true);

                }
            );

            eventSource.addEventListener(
                "connected",
                (event) => {

                    console.log(
                        "✅ SSE CONNECTED EVENT"
                    );

                    console.log(
                        "SSE DATA:",
                        event.data
                    );

                }
            );

            eventSource.addEventListener(
                "error",
                (event) => {

                    console.log(
                        "❌ SSE ERROR:",
                        event
                    );

                    setConnected(false);

                }
            );

            eventSource.addEventListener(
                "close",
                () => {

                    console.log(
                        "⚠️ SSE CLOSED"
                    );

                    setConnected(false);

                }
            );
        }

        connectSSE();

        return () => {

            cancelled = true;

            console.log(
                "SSE CLEANUP"
            );

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