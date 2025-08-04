import { NextResponse } from 'next/server';

let userProfile: any = {
    name: "ผู้ดูแลระบบ",
    position: "IT Management",
    avatar: "/avatar.png"
};

export async function GET() {
    return NextResponse.json(userProfile);
}

export async function PUT(request: Request) {
    const data = await request.json();
    userProfile = { ...userProfile, ...data };
    return NextResponse.json(userProfile);
}
