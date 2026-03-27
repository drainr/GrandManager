import React, { useState, useEffect } from 'react';
import RedButton from "../RedButton.jsx";

const Weblist = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ url: '', name: '' });
  
  const defaultLinks = [
    { id: 1, name: "Women's Wear Daily", url: "https://www.wwd.com" },
    { id: 2, name: "New York Times", url: "https://www.nytimes.com" },
  ];

  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('dash-links');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : defaultLinks;
    }
    return defaultLinks;
  });

  useEffect(() => {
    localStorage.setItem('dash-links', JSON.stringify(links));
  }, [links]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.url || !formData.name) return;
    const formattedUrl = formData.url.startsWith('http') ? formData.url : `https://${formData.url}`;
    setLinks([...links, { id: Date.now(), url: formattedUrl, name: formData.name }]);
    setFormData({ url: '', name: '' });
    setShowModal(false);
  };

  const removeLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div style={{ padding: '30px', background: '#EBB537', marginTop: '20px',left:"20px" }} className='shadow-2xl shadow-black p-6 rounded-xl'>
      <h1 style={{ marginBottom: '25px', color: '#4d2c72' }} className='shrikhand-regular'>Frequently Used</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        {links.map(link => (
          <div key={link.id} style={{ position: 'relative', width: '70px', textAlign: 'center' }}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{
                width: '64px', height: '64px', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '10px', margin: '0 auto'
              }}>
                <img 
                  src={`https://www.google.com/s2/favicons?sz=128&domain=${link.url}`} 
                  alt={link.name}
                  style={{ width: '30px', height: '30px' }}
                />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#222', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
              marginBottom: '10px', padding: 0
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