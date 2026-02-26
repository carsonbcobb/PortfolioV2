import React, { useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import outputs from '../../amplify_outputs.json';
import AdminForm from './AdminForm';

export default function Admin() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/admin/admin.css';
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  const isAuthConfigured = outputs.auth?.user_pool_id && !outputs.auth.user_pool_id.includes('PLACEHOLDER');

  if (!isAuthConfigured()) {
    return (
      <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <h1>Admin</h1>
        <p>
          Run <code>npx ampx sandbox</code>, then copy the generated <code>amplify_outputs.json</code> from the
          project root to <code>src/amplify_outputs.json</code> so sign-in works.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <a href="/admin/">Use static admin page (no Auth) →</a>
        </p>
      </div>
    );
  }

  return (
    <Authenticator>
      {() => <AdminForm />}
    </Authenticator>
  );
}
