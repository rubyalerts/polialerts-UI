import { redirect } from 'next/navigation';

const HomePage = () => {
  // Redirect to /dashboard
  redirect('/dashboard');

  return null;
};

export default HomePage;