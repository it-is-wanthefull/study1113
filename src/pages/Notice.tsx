import { ContentBox } from '../component/common/ContentBox/ContentBox';
import { NoticeSearch } from '../component/page/Notice/NoticeSearch/NoticeSearch';
import { NoticeMain } from '../component/page/Notice/NoticeMain/NoticeMain';

export const Notice = () => {
    return (
        <>
            <ContentBox>공지사항</ContentBox>
            <NoticeSearch />
            <NoticeMain />
        </>
    );
};
