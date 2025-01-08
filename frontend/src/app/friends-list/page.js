"use client";
import React, { useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import { FriendCardSkeleton, NoFriendsMessage } from "@/lib/Skeleton";
import FriendRequest from "./FriendRequest";
import FriendsSuggestion from "./FriendsSuggestion";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const friendRequest = [{}];  // Example friend request data
  const friendSuggestion = [{}];  // Example friend suggestion data

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[rgb(36,37,38)]">
      <LeftSideBar />
      <main className="ml-0 md:ml-64 mt-16 p-6">
        <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <FriendCardSkeleton />
          ) : friendRequest.length === 0 ? (
            <NoFriendsMessage
              text="No Friend Requests"
              description="Looks like you're all caught! Why not explore and connect with new people?"
            />
          ) : (
            friendRequest.map((friend, index) => (
              <FriendRequest key={index} friend={friend} />
            ))
          )}
        </div>

        <h1 className="text-2xl font-bold mb-6">People you may know</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!loading ? (
            <FriendCardSkeleton />
          ) : friendSuggestion.length === 1 ? (
            <NoFriendsMessage
              text="No Friend Suggestions"
              description="Looks like you're all caught! Why not explore and connect with new people?"
            />
          ) : (
            friendSuggestion.map((friend, index) => (
              <FriendsSuggestion key={index} friend={friend} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
