'use client';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Profile from '@components/profile'

const MyProfile = () => {

    const router = useRouter();
    const {data : session } = useSession();
    const [posts , setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () =>{
          const response = await fetch(`/api/users/${session?.user.id}/posts`);
          const data = await response.json();
          
          setPosts (data);
        }
      
        if(session?.user.id)fetchPosts();
      }, [])

    const handleEdit = (post) => {
     router.push(`/update-prompt?id=${post._id}`)
    }
    
    const handleDelete = async (post) => {
      const hasConfirmed = window.confirm("Are you sure that you want to delete the selected prompt?");
  
      if (hasConfirmed) {
          try {
              // Send a DELETE request to the server to delete the prompt
              const response = await fetch(`/api/prompt/${post._id.toString()}`, { method: 'DELETE' });
  
              // Check if the request was successful
              if (response.ok) {
                  // Remove the deleted prompt from the state
                  setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
                  // Provide feedback to the user
                  alert('Prompt deleted successfully.');
              } else {
                  // If the request failed, throw an error
                  throw new Error('Failed to delete the prompt.');
              }
          } catch (error) {
              // Handle any errors that occurred during the deletion process
              console.error('Error deleting prompt:', error);
              alert('Failed to delete the prompt. Please try again later.');
          }
      }
  };
  

    return (
    <Profile
     name="My"
     desc = "Welcome to your personalized profile page"
     data = {posts}
     handleEdit = {handleEdit}
     handleDelete = {handleDelete}
    />
  )
}

export default MyProfile; 