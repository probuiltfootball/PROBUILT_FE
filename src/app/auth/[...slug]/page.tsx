import { redirect } from 'next/navigation';

export default function AuthCatchAllPage() {
  // Redirect any unmatched /auth/* routes to the home page
  // This catch-all route specifically matches /auth/* paths only
  redirect('/');
}

