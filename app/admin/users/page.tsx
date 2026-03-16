"use client";

import { useState } from "react";
import { UserRow } from "@/components/admin/users/types";
import { UserHeader } from "@/components/admin/users/user-header";
import { UserTable } from "@/components/admin/users/user-table";

const MOCK_USERS: UserRow[] = [
  { id: 1, name: "Janrey Habla", email: "janrey@example.com", plan: "Pro", quizzesGenerated: 145, status: "Active", joinedDate: "2024-01-15T10:00:00Z" },
  { id: 2, name: "Mina San Jose", email: "mina@example.com", plan: "School", quizzesGenerated: 89, status: "Active", joinedDate: "2024-02-20T14:30:00Z" },
  { id: 3, name: "Alex Rivera", email: "alex@example.com", plan: "Basic", quizzesGenerated: 34, status: "Active", joinedDate: "2024-03-05T09:15:00Z" },
  { id: 4, name: "Sarah Chen", email: "sarah@example.com", plan: "Free", quizzesGenerated: 5, status: "Active", joinedDate: "2024-03-10T16:45:00Z" },
  { id: 5, name: "Marcus Thorne", email: "marcus@example.com", plan: "Pro", quizzesGenerated: 198, status: "Active", joinedDate: "2023-12-01T11:20:00Z" },
  { id: 6, name: "Elena Gilbert", email: "elena@example.com", plan: "Basic", quizzesGenerated: 12, status: "Active", joinedDate: "2024-01-25T08:00:00Z" },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>(MOCK_USERS);
  const [search, setSearch] = useState("");

  const handleSaveEdit = (userId: number, draft: { name: string; email: string }) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, name: draft.name.trim() || user.name, email: draft.email.trim() || user.email }
          : user,
      ),
    );
  };

  const handleDelete = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleReset = () => {
    setUsers(MOCK_USERS);
  };

  return (
    <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-8">
        <UserHeader onReset={handleReset} />
        <UserTable
          users={users}
          search={search}
          onSearchChange={setSearch}
          onSaveEdit={handleSaveEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
