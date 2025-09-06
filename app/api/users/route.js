// app/api/users/route.ts

import { NextResponse } from 'next/server';

export function GET() {
  const users =[
    {
      id: '1',
      name: 'Aisha Khan',
      email: 'aisha.khan@example.com',
      phone: '+92 300 1234567',
      photoUrl: 'https://i.pravatar.cc/150?img=12',
      city: 'Lahore, Pakistan',
      registeredAt: 'March 2023',
      rides: [
        { date: '2023-06-21', origin: 'Lahore', destination: 'Islamabad', fare: 1500 },
        { date: '2023-07-04', origin: 'Lahore', destination: 'Karachi', fare: 3500 },
      ],
    },
    {
      id: '2',
      name: 'David Smith',
      email: 'david.smith@example.com',
      phone: '+1 415 555 0198',
      photoUrl: 'https://i.pravatar.cc/150?img=5',
      city: 'San Francisco, USA',
      registeredAt: 'January 2022',
      rides: [
        { date: '2023-05-01', origin: 'San Francisco', destination: 'Los Angeles', fare: 120 },
        { date: '2023-06-12', origin: 'San Francisco', destination: 'San Jose', fare: 45 },
      ],
    },
    {
      id: '3',
      name: 'Mei Wong',
      email: 'mei.wong@example.com',
      phone: '+65 8123 4567',
      photoUrl: 'https://i.pravatar.cc/150?img=20',
      city: 'Singapore',
      registeredAt: 'July 2021',
      rides: [
        { date: '2023-03-14', origin: 'Singapore', destination: 'Kuala Lumpur', fare: 75 },
      ],
    },
  ];
  return NextResponse.json(users);
}
