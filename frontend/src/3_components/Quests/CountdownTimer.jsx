
import { useEffect, useState } from "react";
import { Text } from "react-native";

import { questDetailsStyles } from "../../Styles/questDetailsStyles";

function getTimerState(deadline, start) {
    const now = Date.now();

    const startTime = start ? new Date(start).getTime() : NaN;
    const deadlineTime = deadline ? new Date(deadline).getTime() : NaN;

    const waitingForStart =
        Number.isFinite(startTime) && now < startTime;

    const targetTime = waitingForStart ? startTime : deadlineTime;

    const remaining = Number.isFinite(targetTime)
        ? Math.max(0, targetTime - now)
        : 0;

    return { remaining, waitingForStart };
}

function CountdownTimer({ deadline, start, isCompleted }) {
    const [timer, setTimer] = useState(
        () => getTimerState(deadline, start)
    );

    useEffect(() => {
        const updateTimer = () => {
            setTimer(getTimerState(deadline, start));
        };

        updateTimer();

        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [deadline, start]);

    // Use timer.remaining, not the undefined variable "remaining".
    const totalSeconds = Math.floor(timer.remaining / 1000);

    const totalHours = Math.floor(totalSeconds / 3600);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime =
        totalHours >= 24
            ? `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`
            : `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;

    return (
        <Text
            style={[
                questDetailsStyles.timeValue,
                {
                    color: isCompleted ? "#22C55E" : "#19C7FF",
                },
            ]}
        >
            {formattedTime}
        </Text>
    );
}

export default CountdownTimer;
