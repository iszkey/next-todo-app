import { useQueryClient, useMutation } from 'react-query';
import { useStore } from '@/store';
import { supabase } from '@/utils/supabase';
import { Task, EditedTask } from '@/types/types';

export const useMutateTask = () => {
    const queryClient = useQueryClient();
    const reset = useStore((state) => state.resetEditedTask);

    const createTaskMutation = useMutation(
        async (task: Omit<Task, 'id' | 'created_at'>) => {
            const { data, error } = await supabase.from('todos').insert(task);
            if (error) throw new Error(error.message);
            return data;
        },
        {
            onSuccess: (res) => {
                // 'todos'というkeyに紐づくキャッシュデータを取得する
                const previousTodos = queryClient.getQueryData<Task[]>([
                    'todos',
                ]);

                if (previousTodos) {
                    // キャッシュデータの更新
                    queryClient.setQueryData(
                        ['todos'],
                        [...previousTodos, res[0]] //スプレット演算子で展開して末尾に新しいtodoを追加する
                    );
                }

                // EditedTaskを初期化する
                reset();
            },
            onError: (err: any) => {
                alert(err.message);
                reset();
            },
        }
    );

    const updateTaskMutation = useMutation(
        async (task: EditedTask) => {
            const { data, error } = await supabase
                .from('todos')
                .update({ title: task.title })
                .eq('id', task.id);
            if (error) throw new Error(error.message);
            return data;
        },
        {
            // variablesはmutationに渡した引数(EditedTask)
            onSuccess: (res, variables) => {
                const previousTodos = queryClient.getQueryData<Task[]>([
                    'todos',
                ]);
                if (previousTodos) {
                    queryClient.setQueryData(
                        ['todos'],
                        previousTodos.map((task) => {
                            task.id === variables.id ? res[0] : task;
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

    const deleteTaskMutation = useMutation(
        async (id: string) => {
            const { data, error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);
            if (error) throw new Error(error.message);
            return data;
        },
        {
            onSuccess: (_, variables) => {
                const previousTodos = queryClient.getQueryData<Task[]>('todos');
                if (previousTodos) {
                    queryClient.setQueryData(
                        'todos',
                        previousTodos.filter((task) => task.id !== variables)
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

    return { deleteTaskMutation, createTaskMutation, updateTaskMutation };
};
