import { FC } from 'react';
import { useQueryNotices } from '@/hooks/useQueryNotices';
import { Spinner } from './Spinner';
import { NoticeItem } from './NoticeItem';

export const NoticeList: FC = () => {
    const { data: notice, status } = useQueryNotices();
    if (status === 'loading') return <Spinner />;
    if (status === 'error') return <p>{'Error'}</p>;
    return (
        <ul className="my-2">
            {notice?.map((notice) => (
                <NoticeItem
                    key={notice.id}
                    id={notice.id}
                    content={notice.content}
                    user_id={notice.user_id}
                />
            ))}
        </ul>
    );
};
