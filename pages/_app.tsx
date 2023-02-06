import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { supabase } from '@/utils/supabase';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

export default function App({ Component, pageProps }: AppProps) {
    const { push, pathname } = useRouter();

    /**
     * ログイン状況に合わせてページを遷移する関数
     */
    const validateSession = async () => {
        /** ログインしているユーザーの情報*/
        const user = supabase.auth.user();

        // ログイン済み　かつ　インデックスページ(ログインページ)　の場合は'/dashboard'に遷移する
        if (user && pathname === '/') {
            push('/dashboard');
        }

        // 未ログイン　かつ　ログインページ以外　だった場合はインデックスページに遷移する
        if (!user && pathname !== '/') {
            await push('/');
        }
    };

    // ログインユーザーのセッションの変化を検知する
    supabase.auth.onAuthStateChange((event, _) => {
        // サインイン（サインアップ含む）を検知したとき　かつ　インデックスページだった場合は /dashboard に遷移する
        if (event === 'SIGNED_IN' && pathname === '/') {
            push('/dashboard');
        }

        // サインアウトを検知したときはインデックスページに遷移する
        if (event === 'SIGNED_OUT') {
            push('/');
        }
    });

    // ブラウザのリロードを実施した場合に必ずvalidateSessionを呼ぶ
    // マウント時に１回だけ呼ばれるように第２引数は空の配列
    useEffect(() => {
        validateSession();
    }, []);

    return (
        // プロジェクト全体にReactQueryを適用するため<QueryClientProviderでラップする
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
