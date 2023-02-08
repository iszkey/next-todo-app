import create from 'zustand/react';
import { EditedTask, EditedNotice } from './types/types';

/**
 * Zustandでグローバルステートの状態管理をするために、
 * 最初に管理するオブジェクトと更新用の関数をまとめて定義する。
 **/

//返り値は特にない場合はvoidを指定する

/** 管理するオブジェクトと関数の型定義 */
type State = {
    editedTask: EditedTask;
    editedNotice: EditedNotice;
    updatedEditedTask: (payload: EditedTask) => void;
    updatedEditedNotice: (payload: EditedNotice) => void;
    resetEditedTask: () => void;
    resetEditedNotice: () => void;
};

/** Zustandのcreateメソッドでステートと更新用の関数を定義する */
export const useStore = create<State>((set) => ({
    editedTask: { id: '', title: '' },
    editedNotice: { id: '', content: '' },
    updatedEditedTask: (payload) => {
        set({
            editedTask: {
                id: payload.id,
                title: payload.title,
            },
        });
    },
    updatedEditedNotice: (payload) => {
        set({
            editedNotice: {
                id: payload.id,
                content: payload.content,
            },
        });
    },
    resetEditedTask: () => set({ editedTask: { id: '', title: '' } }),
    resetEditedNotice: () => ({ editedNotice: { id: '', content: '' } }),
}));
