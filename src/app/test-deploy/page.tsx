export default function TestDeploy() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Deployment Test Page</h1>
      <p>If you can see this, deployment is working!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      <a href="/admin-panel">Go to Admin Panel</a>
    </div>
  )
}