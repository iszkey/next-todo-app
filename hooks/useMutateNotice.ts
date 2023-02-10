import { supabase } from '@/utils/supabase';
import { useQueryClient, useMutation } from 'react-query';
import { useStore } from '@/store';
import { Notice, EditedNotice } from '@/types/types';

export const useMutateNotice = () => {
    const queryClient = useQueryClient();
    const reset = useStore((state) => state.resetEditedNotice);

    const createNoticeMutation = useMutation(
        async (notice: Omit<Notice, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('notices')
                .insert(notice);
            if (error) throw new Error(error.message);
            return data;
        },
        {
            onSuccess: (res) => {
                // 'notices'というkeyに紐づくキャッシュデータを取得する
                const previousNotices = queryClient.getQueryData<Notice[]>([
                    'notices',
                ]);

                if (previousNotices) {
                    // キャッシュデータの更新
                    queryClient.setQueryData(
                        ['notices'],
                        [...previousNotices, res[0]] //スプレット演算子で展開して末尾に新しいtodoを追加する
                    );
                }

                // EditedNoticeを初期化する
                reset();
            },
            onError: (err: any) => {
                alert(err.message);
                reset();
            },
        }
    );

    const updateNoticeMutation = useMutation(
        async (notice: EditedNotice) => {
            const { data, error } = await supabase
                .from('notices')
                .update({ title: notice.content })
                .eq('id', notice.id);
            if (error) throw new Error(error.message);
            return data;
        },
        {
            // variablesはmutationに渡した引数(EditedNotice)
            onSuccess: (res, variables) => {
                const previousNotices = queryClient.getQueryData<Notice[]>([
                    'notices',
                ]);
                if (previousNotices) {
                    queryClient.setQueryData(
                        ['notices'],
                        previousNotices.map((notice) => {
                            notice.id === variables.id ? res[0] : notice;
                        })
                    );
                }
                reset();
            },
            onError: (err: any) => {
                alert(err.message);
                reset();
            },
        }
    );

    const deleteNoticeMutation = useMutation(
        async (id: string) => {
            const { data, error } = await supabase
                .from('notices')
                .delete()
                .eq('id', id);
            if (error) throw new Error(error.message);
            return data;
        },
        {
            onSuccess: (_, variables) => {
                const previousNotices =
                    queryClient.getQueryData<Notice[]>('notices');
                if (previousNotices) {
                    queryClient.setQueryData(
                        'notices',
                        previousNotices.filter(
                            (notice) => notice.id !== variables
                        )
                    );
                }
                reset();
            },
            onError: (err: any) => {
                alert(err.message);
                reset();
            },
        }
    );

    return { deleteNoticeMutation, createNoticeMutation, updateNoticeMutation };
};
