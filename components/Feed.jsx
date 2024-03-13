'use client';
import React, { useState , useEffect } from 'react'
import PromptCard from './PromptCard';

const PromptCardList = ({data , handleTagClick}) =>{
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post)=>(
        <PromptCard
         key = {post._id}
         post = {post}
         handleTagClick = {handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchTimeOut, setSearchTimeOut] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [posts, setPosts] = useState([])
  const handleSearchChange = (e) =>{
    const { value } = e.target;
    setSearchText(value);

    // Filter posts based on search text
    const filtered = posts.filter((post) =>
      post.prompt.toLowerCase().includes(value.toLowerCase()) ||
      post.tag.toLowerCase().includes(value.toLowerCase()) ||
      (post.username && post.username.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredPosts(filtered);
  }
  
  useEffect(() => {
    const fetchPosts = async () =>{
      const response = await fetch('api/prompt');
      const data = await response.json();
      
      setPosts (data);
      setFilteredPosts(data);
    }
  
    fetchPosts();
  }, [])
   

  return (
    <section className='feed'>
     <form className='relative w-full flex-center'>
      <input type="text"
       placeholder='Search for the tag or the username'
       value={searchText}
       onChange={handleSearchChange}
       required
       className='search_input peer'
      />
     </form>
     <PromptCardList
      data = {posts}
      handleTagClick = {() => {}}
     />
    </section>
  )
}

export default Feed