import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useMutation } from "react-query";

export const useMutateAuth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    
    const reset = () => {
        setEmail('');
        setPassword('');
    }

    /**
     * ログインボタンを押したときに実行される関数
     */
    const loginMutation = useMutation(

        /**
         * useMutation で実行する非同期関数
         */
        async () => {
            const {error} = await supabase.auth.signIn({email, password});
            if(error) throw new Error(error.message);
        },
        {
            // useMutationで失敗したときの処理はonErrorで定義することができる
            onError: (err:any) => {
                alert(err.message);
                reset();
            }

            // 成功したときの処理はonSuccessに記載する
        }
    )

    //　新しいユーザーを追加する際の関数
    const registerMutation = useMutation(
        async () => {
            const {error} = await supabase.auth.signUp({email, password});
            if(error) throw new Error(error.message);
        },
        {
            onError:(err:any) => {
                alert(err.message);
                reset();
            }
        }
    )
    
    return {
        email,
        setEmail,
        password,
        setPassword,
        loginMutation,
        registerMutation
    };

}