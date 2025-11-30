import { NextRequest, NextResponse } from "next/server";
import { connectionDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashedPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        await connectionDB()
        const body = await request.json()
        const { username, email, password } = body
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassworddata = await hashedPassword(password);

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassworddata
        });

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            username: user.username
        });

        return NextResponse.json(
            {
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    points: user.points,
                    level: user.level
                }
            },
            { status: 201 }
        );

    } catch (error:any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}