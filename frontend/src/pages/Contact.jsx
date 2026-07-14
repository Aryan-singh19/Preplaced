import React from 'react';

const Contact = () => {
  return (
    <div style={{ padding: '100px 5%', textAlign: 'center', minHeight: '60vh', backgroundColor: '#f8fafc' }}>
      <h1 style={{ fontSize: '3rem', color: '#0f172a' }}>Contact Us</h1>
      <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#64748b' }}>
        Have questions? Reach out to us at our social handles.
      </p>
      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '1.2rem' }}>
        <p><strong>GitHub:</strong> <a href="https://github.com/Arti2410" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>github.com/Arti2410</a></p>
        <p><strong>Instagram:</strong> <a href="https://www.instagram.com/elitecodr0110/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>@elitecodr0110</a></p>
      </div>
    </div>
  );
};

export default Contact;
