import { AuthForm, AuthLayout } from '@/components/auth/auth-components';
export default function Page(){return <AuthLayout title="Recover access" subtitle="Request a password reset link without exposing whether an email exists."><AuthForm mode="forgot"/></AuthLayout>}
