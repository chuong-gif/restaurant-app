export interface Table {
    id: string;
    name: string;
    capacity: number;
    status: "available" | "booked";
}

export const mockTables: Table[] = [
    { id: "t1", name: "Bàn 1", capacity: 2, status: "available" },
    { id: "t2", name: "Bàn 2", capacity: 2, status: "booked" },
    { id: "t3", name: "Bàn 3", capacity: 4, status: "available" },
    { id: "t4", name: "Bàn 4", capacity: 4, status: "booked" },
    { id: "t5", name: "Bàn 5", capacity: 6, status: "available" },
    { id: "t6", name: "Bàn 6", capacity: 8, status: "booked" },
];
