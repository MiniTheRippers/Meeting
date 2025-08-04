import { NextResponse } from 'next/server';

let rooms: any[] = []; // ตัวแปรเก็บข้อมูลจำลอง

export async function GET() {
    return NextResponse.json(rooms);
}

export async function POST(request: Request) {
    const data = await request.json();
    // หาเลขลำดับถัดไป
    let nextNumber = 1;
    if (rooms.length > 0) {
        // หาเลขสูงสุดที่มีอยู่แล้ว
        const numbers = rooms.map(r => {
            const match = r._id?.match(/^MR-(\d+)$/);
            return match ? parseInt(match[1], 10) : 0;
        });
        nextNumber = Math.max(...numbers) + 1;
    }
    const newRoom = { ...data, _id: `MR-${nextNumber}` };
    rooms.push(newRoom);
    return NextResponse.json(newRoom, { status: 201 });
}

export async function PUT(request: Request) {
    const data = await request.json();
    const idx = rooms.findIndex(r => r._id === data._id);
    if (idx === -1) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    rooms[idx] = data;
    return NextResponse.json(rooms[idx]);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('_id');
    if (!id) {
        return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
    }
    rooms = rooms.filter(r => r._id !== id);
    return NextResponse.json({ success: true });
}
