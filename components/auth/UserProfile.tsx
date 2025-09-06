
'use client'

//backend version
import { useEffect, useState } from 'react';
type Ride = {
  date: string;
  origin: string;
  destination: string;
  fare: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  city: string;
  registeredAt: string;
  rides: Ride[];
};


export default function UserProfile()  {
 const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setUser(data[1]); // get the first user
      });
  }, []);

  if (!user) {
    return <p className="text-center mt-8">Loading user profile...</p>;
  }
return   <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-lg p-10">
      <div className="flex flex-col items-center text-center">
        <img
          className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-md object-cover"
          src={user.photoUrl}
          alt="User avatar"
        />
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-gray-500">{user.phone}</p>
        <p className="mt-2 text-gray-600 text-sm">
          Registered user since <span className="font-medium">{user.registeredAt}</span>
        </p>
        <p className="text-gray-600 text-sm">{user.city}</p>
      </div>
       <div className="mt-4">
            <h3 className="text-lg font-semibold">Ride History</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
              {user.rides.map((ride, index) => (
                <li key={index} className='m-10'>
                  {ride.date}: {ride.origin} → {ride.destination} (${ride.fare})
                </li>
              ))}
            </ul>
          </div>
    </div>
};
