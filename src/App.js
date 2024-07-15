import './App.css';
import React, {useEffect, useState, useCallback, useRef} from 'react'


function App() {
  const [image ,setimage] = useState([])
  const [loading, setloading] = useState(false)
  const [post,setpost] = useState(1)
  const observer = useRef()

  useEffect(() => {
    fetchPosts()
  }, [])

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setpost((prevPage) => prevPage + 1); 
        }
      });
      console.log("loading....")

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const loadMorePosts = async () => {
    setloading(true);
    const newPosts = await fetchPosts(post, 10);
    console.log('new post',newPosts)
    setimage((prevPosts) => [...prevPosts, ...newPosts]);
    setloading(false);
  };

  useEffect(() => {
    loadMorePosts();
  }, [post]);

 const fetchPosts = async (page, limit) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${limit}`
    );
    const data = await response.json();
    return data;
  };
  
  return (
    <div className="App">
       <ul>
        {image.map((post, index) => (
          <li
            key={post.id}
            ref={image.length === index + 1 ? lastPostElementRef : null}
          >
            <img src={post.url} style={{width:200, height:200}}/>
     
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default App;
