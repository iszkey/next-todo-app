import { useState, FormEvent } from 'react';
import { BadgeCheckIcon, ShieldCheckIcon } from '@heroicons/react/solid';
import { Layout } from '@/components/Layout';
import { NextPage } from 'next';
import { useMutateAuth } from '@/hooks/useMutateAuth';

const Auth: NextPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const {
        email,
        setEmail,
        password,
        setPassword,
        loginMutation,
        registerMutation,
    } = useMutateAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        // submit によるページのリロードを防ぐ
        e.preventDefault();

        if (isLogin) {
            loginMutation.mutate();
        } else {
            registerMutation.mutate();
        }
    };
    return <Layout title="Home">{'hello'}</Layout>;
};

export default Auth;
