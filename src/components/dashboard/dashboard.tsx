"use client";

import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const user = useUser();
  return (
    <div>
      <h1>{user?.user?.firstName}</h1>
    </div>
  );
}
