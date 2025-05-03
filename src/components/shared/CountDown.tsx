import { useEffect, useState } from "react";


interface CountDownProps {
    callBack?: () => void;
    time: number;
}

export default function CountDown({ callBack, time }: CountDownProps) {
    const [count, setCount] = useState(time);

    useEffect(() => {
        if (count <= 0) {
            if (callBack) {
                callBack();
            }
            return;
        }
        const timer = setTimeout(() => {
            setCount((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [count]);

    return (
        <div className="text-white text-4xl font-bold text-center">
            {count > 0 ? count : "GO!"}
        </div>
    );

}