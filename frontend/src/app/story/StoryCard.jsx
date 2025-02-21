"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import userStore from "../../store/userStore";
import ShowStoryPreview from "./ShowStoryPreview";

const StoryCard = ({ isAddStory, story }) => {
  const { user } = userStore();
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleCreateStory } = usePostStore();
  const [showPreview, setShowPreview] = useState(false);
  const [isNewStory, setIsNewStory] = useState(false);

  const fileInputRef = useRef(null);

  const userPlaceholder = story?.user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleFileChnage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file),
        setFileType(file.type.startsWith("video") ? "video" : "image");
      setFilePreview(URL.createObjectURL(file));
      setIsNewStory(true);
      setShowPreview(true);
    }
    e.target.value = "";
  };

  const handleCreateStoryPost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append("media", selectedFile);
      }
      await handleCreateStory(formData);
      resetStoryState();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    resetStoryState();
  };

  const resetStoryState = () => {
    setShowPreview(false);
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setIsNewStory(false);
  };

  const handleStoryClick = () => {
    setFilePreview(story?.mediaUrl);
    setFileType(story?.mediaType);
    setIsNewStory(false);
    setShowPreview(true);
  };

  // const handleStoryClick = () => {};

  return (
    <>
      <Card
        className="w-40 h-60 relative overflow-hidden group cursor-pointer rounded-xl"
        onClick={isAddStory ? undefined : handleStoryClick}
      >
        <CardContent className="p-0 h-full">
          {isAddStory ? (
            <div className="w-full h-full flex flex-col justify-between">
              {/* Avatar Section */}
              <div className="h-3/4 w-full relative border-b">
                {/* <Avatar className="w-full h-full  rounded-none">
                  <AvatarImage />
                  <p className="w-full h-full flex justify-center items-center text-4xl dark:text-white">
                    T
                  </p>
                </Avatar> */}
                <Avatar className="w-full h-full rounded-none">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                      className="object-cover"
                    />
                  ) : (
                    <p className="w-full h-full flex justify-center items-center text-4xl">
                      {userPlaceholder}
                    </p>
                  )}
                </Avatar>
              </div>

              {/* Create Story Section */}
              {/* <div className="h-1/4 w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 rounded-full bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="h-5 w-5 text-white"></Plus>
                </Button>
                <p className="text-xs font-semibold mt-1">Create Story</p>
              </div> */}
              <div className="h-1/4 w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Plus className="h-5 w-5 text-white" />
                </Button>
                <p className="text-xs font-semibold mt-1">Create Story</p>
              </div>

              {/* Hidden Input */}
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChnage}
              />
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
              {/* <div className="absolute top-2 left-2 ring-2 ring-blue-500 rounded-full">
                <Avatar className="w-full h-full">
                  <AvatarImage />
                  <p className="w-full h-full flex justify-center items-center text-4xl">
                    T
                  </p>
                </Avatar>
              </div> */}

              <div className="absolute top-2 left-2 rounded-full ring-2 ring-green-600 flex items-center justify-center w-10 h-10 ">
                {/* <Avatar className="w-full h-full">
                  <AvatarImage />
                  <p className="w-full h-full flex justify-center items-center text-4xl dark:text-white">
                    T
                  </p>
                </Avatar> */}

                <Avatar className="w-8 h-8">
                  {story?.user?.profilePicture ? (
                    <AvatarImage
                      src={story?.user?.profilePicture}
                      alt={story?.user?.username}
                    />
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-black dark:text-white text-xs font-semibold truncate">
                  {/* Nusrat Tazin */}
                  {story?.user?.username}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {showPreview && (
      <ShowStoryPreview
        file={filePreview}
        fileType={fileType}
        onClose={handleClosePreview}
        onPost= {handleCreateStoryPost}
        isNewStory={isNewStory}
        username = {isNewStory ? user?.username : story?.user?.username}
        avatar = {isNewStory ? user?.profilePicture : story?.user?.profilePicture}
        isLoading={loading}
      
      />
     )}

    </>
  );
};

export default StoryCard;

// "use client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Plus } from "lucide-react";
// import React, { useRef, useState } from "react";

// const StoryCard = ({ isAddStory, story, userName, avatarLetter }) => {
//   const handleStoryClick = () => {};

//   return (
//     <Card
//       className="w-40 h-60 relative overflow-hidden group cursor-pointer rounded-xl"
//       onClick={isAddStory ? undefined : handleStoryClick}
//     >
//       <CardContent className="p-0 h-full">
//         {isAddStory ? (
//           <div className="w-full h-full flex flex-col justify-between">
//             {/* Avatar Section */}
//             <div className="h-3/4 w-full relative border-b">
//               <Avatar className="w-full h-full">
//                 <AvatarImage />
//                 <p className="w-full h-full flex justify-center items-center text-4xl dark:text-white">
//                   T
//                 </p>
//               </Avatar>
//             </div>

//             {/* Create Story Section */}
//             <div className="h-1/4 w-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="p-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
//               >
//                 <Plus className="h-5 w-5 text-white" />
//               </Button>
//               <p className="text-xs font-semibold mt-1">Create Story</p>
//             </div>

//             {/* Hidden Input */}
//             <input type="file" accept="image/*,video/*" className="hidden" />
//           </div>
//         ) : (
//           <>
//             {story?.mediaType === "image" ? (
//               <img
//                 src={story?.mediaUrl}
//                 alt={story.user.username}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <video
//                 src={story?.mediaUrl}
//                 alt={story.user.username}
//                 className="w-full h-full object-cover"
//               />
//             )}

//             <div className="absolute top-2 left-2 rounded-full ring-2 ring-blue-500 flex items-center justify-center w-10 h-10">
//               <Avatar className="w-full h-full">
//                 <AvatarImage />
//                 <p className="w-full h-full flex justify-center items-center text-4xl text-gray-100">
//                   {avatarLetter}
//                 </p>
//               </Avatar>
//             </div>

//             <div className="absolute bottom-2 left-2 right-2">
//               <p className="text-gray-100 dark:text-white text-xs font-semibold truncate">
//                 {userName}
//               </p>
//             </div>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// const StoryCardsContainer = () => {
//   return (
//     <div className="flex space-x-4">
//       <StoryCard
//         isAddStory={true}
//         userName="Nusrat Tazin"
//         avatarLetter="T"
//       />
//             <StoryCard
//         isAddStory={false}
//         userName="Nusrat Tazin"
//         avatarLetter="T"
//         story={{
//           mediaType: "image",
//           mediaUrl: "https://t4.ftcdn.net/jpg/05/70/26/97/360_F_570269734_gE4Za4bdlmm5MLhjScliP4zmOORgDJ3t.jpg",
//           user: { username: "Tazin" }
//         }}
//       />
//       <StoryCard
//         isAddStory={false}
//         userName="Rashme Akther"
//         avatarLetter="R"
//         story={{
//           mediaType: "image",
//           mediaUrl: "https://www.mysticbengal.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdaxj3l4ed%2Fimage%2Fupload%2Fv1724695461%2Fasp8rf11m2u7xj1fyq8s.png&w=1920&q=75",
//           user: { username: "Rashme" }
//         }}
//       />
//       <StoryCard
//         isAddStory={false}
//         userName="Walisa Alam"
//         avatarLetter="W"
//         story={{
//           mediaType: "image",
//           mediaUrl: "https://media2.thrillophilia.com/images/photos/000/371/357/original/1618245974_shutterstock_1186362172.jpg?w=753&h=450&dpr=1.5",
//           user: { username: "Walisa" }
//         }}
//       />
//       <StoryCard
//         isAddStory={false}
//         userName="Pritha Saha"
//         avatarLetter="P"
//         story={{
//           mediaType: "image",
//           mediaUrl: "https://images.unsplash.com/photo-1548393488-ae8f117cbc1c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmlnaHQlMjBzdHVkeXxlbnwwfHwwfHx8MA%3D%3D",
//           user: { username: "Pritha" }
//         }}
//       />
//     </div>
//   );
// };

// export default StoryCardsContainer;
