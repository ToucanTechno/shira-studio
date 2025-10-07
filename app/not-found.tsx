export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>הדף לא נמצא</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        מצטערים, הדף שחיפשת לא קיים
      </p>
      <a 
        href="/" 
        style={{
          padding: '10px 20px',
          backgroundColor: '#cea525',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '1.1rem'
        }}
      >
        חזרה לדף הבית
      </a>
    </div>
  );
}