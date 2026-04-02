import React, { useState, useEffect } from 'react';
import RedButton from "../RedButton.jsx";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { listenToBookmarks, updateBookmarks } from '../../firebase/weblistManager';

const Weblist = () => {
  const [links, setLinks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ url: '', name: '' });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribeAuth();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.url || !formData.name || !userId) return;

    const formattedUrl = formData.url.startsWith('http') ? formData.url : `https://${formData.url}`;
    const newLinks = [...links, { id: Date.now(), url: formattedUrl, name: formData.name }];
    
    await updateBookmarks(userId, newLinks);
    setFormData({ url: '', name: '' });
    setShowModal(false);
  };

  const removeLink = async (id) => {
    if (!userId) return;
    const updatedLinks = links.filter(link => link.id !== id);
    await updateBookmarks(userId, updatedLinks);
  };

  useEffect(() => {
    if (!userId) return;

    const unsubscribeWeblist = listenToBookmarks(userId, (data) => {
      setLinks(data);
    });

    return () => unsubscribeWeblist();
  }, [userId]);

  return (
    <div style={{ background: '#EBB537', marginTop: '0px', border: '1px solid #4d2c72'}} className='shadow-2xl shadow-black p-4 md:p-6 rounded-xl w-full max-w-[600px]'>
      <h1 style={{ marginTop: '0px', marginBottom: '25px', color: '#4d2c72' }} className='shrikhand-regular'>Frequently Used</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        {links.map(link => (
          <div key={link.id} style={{ position: 'relative', width: '70px', textAlign: 'center' }}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{
                width: '64px', height: '64px', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '5px', margin: '0 auto'
              }}>
                <img 
                  src={`https://www.google.com/s2/favicons?sz=128&domain=${link.url}`} 
                  alt={link.name}
                  style={{ width: '30px', height: '30px' }}
                />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#222', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '10px' }}>
                {link.name}
              </span>
            </a>
            <div className='absolute bottom-18 left-8 z-5 scale-45'>
            <RedButton text='x'
              onClick={() => removeLink(link.id)} 

            >
              <span style={{ marginTop: '-1px' }}>×</span>
            </RedButton></div>
          </div>
        ))}

        <div style={{ width: '70px', textAlign: 'center' }}>
          <button 
            onClick={() => setShowModal(true)}
            style={{
              width: '64px', height: '64px', border: '2px dashed #ccc',
              background: '#fafafa', color: '#888', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
              marginBottom: '0px'
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: '300', marginTop: '-4px' }}>+</span>
          </button>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#888' }}>Add</span>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '340px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '20px', fontFamily: 'sans-serif' }}>Add Bookmark</h4>
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444', fontFamily: 'sans-serif' }}>Website Name</label>
                <input 
                  autoFocus 
                  type="text"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  style={{ 
                    width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', 
                    fontSize: '14px', boxSizing: 'border-box', color: '#000', backgroundColor: '#fff' 
                  }} 
                />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444', fontFamily: 'sans-serif' }}>URL</label>
                <input 
                  type="text"
                  value={formData.url} 
                  onChange={e => setFormData({...formData, url: e.target.value})} 
                  style={{ 
                    width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', 
                    fontSize: '14px', boxSizing: 'border-box', color: '#000', backgroundColor: '#fff' 
                  }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 18px', background: '#f5f5f5', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 18px', background: '#04A7F9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weblist;