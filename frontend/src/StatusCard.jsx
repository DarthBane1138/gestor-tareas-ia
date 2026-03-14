import { useEffect, useState } from "react";

function formatDateTime(date) {
    return new Intl.DateTimeFormat('es-CL', {
        dateStyle: 'full',
        timeStyle: 'medium',
    }).format(date)
}

export default function StatusCard() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

    return (
        <section className="card">
            <h1>Frontend operativo</h1>
            <p>React + Vite funcionando</p>
            <p className="time">{formatDateTime(now)}</p>
        </section>
    )
}