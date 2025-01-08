import { ChevronDown, ChevronUp, Send } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formateDate } from "@/lib/utils";

const PostComments = ({ post, user }) => {
    const [showAllComments, setShowAllComments] = useState(false);
    const visibleComments = showAllComments ? post?.comments : post?.comments?.slice(0, 2);
  
    return (
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Comments</h3>
        <div className="max-h-60 overflow-y-auto pr-2">
          {visibleComments?.map((comment, index) => (
            <div key={index} className="flex items-start space-x-2 mb-2">
              <Avatar className="w-8 h-8">
                <AvatarImage />
                <AvatarFallback className="dark:bg-gray-400">R</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="rounded-lg p-2">
                  <p className="font-bold text-sm">{comment?.user?.username}</p>
                  <p className="text-sm">{comment?.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        <div className="flex items-center space-x-2 mt-4">
          {user && (
            <Avatar className="w-8 h-8">
              {user.profilePicture ? (
                <AvatarImage src={user.profilePicture} alt={user.username} />
              ) : (
                <AvatarFallback className="dark:bg-gray-400">U</AvatarFallback>
              )}
            </Avatar>
          )}
          <Input placeholder="Write a comment..." className="flex-grow rounded-full h-12 dark:bg-gray-700" />
          <Button variant="ghost">
            <Send className="h-5 w-5 text-blue-500" />
          </Button>
        </div>
      </div>
    );
  };
  

export default PostComments;
