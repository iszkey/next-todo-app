import { NextPage } from 'next';
import {
    LogoutIcon,
    StatusOnlineIcon,
    DocumentTextIcon,
} from '@heroicons/react/solid';
import { supabase } from '@/utils/supabase';
import { Layout } from '@/components/Layout';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';

const Dashboard: NextPage = () => {
    const signOut = () => {
        supabase.auth.signOut();
    };
    return (
        <Layout title="Dashboard">
            <LogoutIcon
                className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
                onClick={signOut}
            />
            <div className="grid-col-2 grid gap-40">
                <div>
                    <div className="my-3 flex justify-center">
                        <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <TaskList />
                    <TaskForm />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
