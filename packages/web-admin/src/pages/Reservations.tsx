import React, { useEffect, useState } from 'react';
import api from '../api/http';

type Reservation = {
    id: number;
    name: string;
    email: string;
    tableNo: number;
    guests: number;
    date: string;
};

export default function Reservations() {
    const [list, setList] = useState<Reservation[]>([]);

    useEffect(() => {
        api.get<Reservation[]>('/reservations').then((r) => setList(r.data));
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Reservations (Admin)</h1>
            <ul>
                {list.map((r) => (
                    <li key={r.id}>
                        {r.name} — {new Date(r.date).toLocaleString()} — Table {r.tableNo}
                    </li>
                ))}
            </ul>
        </div>
    );
}
