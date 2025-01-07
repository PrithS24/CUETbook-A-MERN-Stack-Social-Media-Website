"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React, { useRef, useState } from "react";

const StoryCard = ({ isAddStory, story, userName, avatarLetter }) => {
  const handleStoryClick = () => {};

  return (
    <Card
      className="w-40 h-60 relative overflow-hidden group cursor-pointer rounded-xl"
      onClick={isAddStory ? undefined : handleStoryClick}
    >
      <CardContent className="p-0 h-full">
        {isAddStory ? (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Avatar Section */}
            <div className="h-3/4 w-full relative border-b">
              <Avatar className="w-full h-full">
                <AvatarImage />
                <p className="w-full h-full flex justify-center items-center text-4xl">
                  T
                </p>
              </Avatar>
            </div>

            {/* Create Story Section */}
            <div className="h-1/4 w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
              >
                <Plus className="h-5 w-5 text-white" />
              </Button>
              <p className="text-xs font-semibold mt-1">Create Story</p>
            </div>

            {/* Hidden Input */}
            <input type="file" accept="image/*,video/*" className="hidden" />
          </div>
        ) : (
          <>
            {story?.mediaType === "image" ? (
              <img
                src={story?.mediaUrl}
                alt={story.user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={story?.mediaUrl}
                alt={story.user.username}
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute top-2 left-2 rounded-full ring-2 ring-blue-500 flex items-center justify-center w-10 h-10">
              <Avatar className="w-full h-full">
                <AvatarImage />
                <p className="w-full h-full flex justify-center items-center text-4xl">
                  {avatarLetter}
                </p>
              </Avatar>
            </div>

            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-gray-100 dark:text-white text-xs font-semibold truncate">
                {userName}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const StoryCardsContainer = () => {
  return (
    <div className="flex space-x-4">
      <StoryCard
        isAddStory={true}
        userName="Nusrat Tazin"
        avatarLetter="T"
      />
            <StoryCard
        isAddStory={false}
        userName="Nusrat Tazin"
        avatarLetter="T"
        story={{
          mediaType: "image",
          mediaUrl: "https://t4.ftcdn.net/jpg/05/70/26/97/360_F_570269734_gE4Za4bdlmm5MLhjScliP4zmOORgDJ3t.jpg",
          user: { username: "Tazin" }
        }}
      />
      <StoryCard
        isAddStory={false}
        userName="Rashme Akther"
        avatarLetter="R"
        story={{
          mediaType: "image",
          mediaUrl: "https://www.mysticbengal.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdaxj3l4ed%2Fimage%2Fupload%2Fv1724695461%2Fasp8rf11m2u7xj1fyq8s.png&w=1920&q=75",
          user: { username: "Rashme" }
        }}
      />
      <StoryCard
        isAddStory={false}
        userName="Walisa Alam"
        avatarLetter="W"
        story={{
          mediaType: "image",
          mediaUrl: "https://media2.thrillophilia.com/images/photos/000/371/357/original/1618245974_shutterstock_1186362172.jpg?w=753&h=450&dpr=1.5",
          user: { username: "Walisa" }
        }}
      />
      <StoryCard
        isAddStory={false}
        userName="Pritha Saha"
        avatarLetter="P"
        story={{
          mediaType: "image",
          mediaUrl: "https://images.unsplash.com/photo-1548393488-ae8f117cbc1c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmlnaHQlMjBzdHVkeXxlbnwwfHwwfHx8MA%3D%3D",
          user: { username: "Pritha" }
        }}
      />
    </div>
  );
};

export default StoryCardsContainer;