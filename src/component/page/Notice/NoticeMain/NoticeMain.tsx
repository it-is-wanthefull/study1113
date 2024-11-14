import { useLocation } from 'react-router-dom';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useRecoilState } from 'recoil';
import { Portal } from '../../../common/potal/Portal';
import { NoticeModal } from '../NoticeModal/NoticeModal';
import { Button } from 'react-bootstrap';
import { modalState } from '../../../../stores/modalState';
import { INotice, INoticeListResponse } from '../../../../models/interface/INotice';
import { postNoticeApi } from '../../../../api/postNoticeApi';
import { Notice } from '../../../../api/api';

export const NoticeMain = () => {
    const { search } = useLocation();
    const [noticeList, setNoticeList] = useState<INotice[]>();
    const [listCount, setListCount] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState); // recoil에 저장된 state
    const [index, setIndex] = useState<number>();

    useEffect(() => {
        searchNoticeList();
    }, [search]); // NoticeSearch에서 navigate()로 띄운 URL쿼리를 로드, URL 중 search부분만 구조분해할당으로 가져옴

    const searchNoticeList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append('currentPage', currentPage.toString());
        searchParam.append('pageSize', '5');

        const searchList = await postNoticeApi<INoticeListResponse>(Notice.getList, searchParam);
        if (searchList) {
            setNoticeList(searchList.notice);
            setListCount(searchList.noticeCnt);
        }
        // axios.post('/board/noticeListJson.do', searchParam)
        //     .then(res => {
        //         setNoticeList(res.data.notice);
        //         setListCount(res.data.noticeCnt);
        //     });
    }

    const handlerModal = (index: number) => {
        setModal(!modal);
        setIndex(index);
    }

    const onPostSuccess = () => {
        setModal(!modal);   
        searchNoticeList(); // List 자동새로고침
    }

    return (
        <>
            총 갯수 : {listCount} 현재 페이지 : 0
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={5}>번호</StyledTh>
                        <StyledTh size={50}>제목</StyledTh>
                        <StyledTh size={10}>작성자</StyledTh>
                        <StyledTh size={20}>등록일</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {
                        noticeList?.length > 0 ? (
                            noticeList?.map((notice) => {
                                return (
                                    <tr key={notice.noticeIdx} onClick={() => handlerModal(notice.noticeIdx)}>
                                        <StyledTd >{notice.noticeIdx}</StyledTd>
                                        <StyledTd >{notice.title}</StyledTd>
                                        <StyledTd >{notice.author}</StyledTd>
                                        <StyledTd >{notice.createdDate}</StyledTd>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
                            </tr>
                        )
                    }
                </tbody>
            </StyledTable>
            {modal &&
                <Portal>
                    <NoticeModal onSuccess={onPostSuccess} noticeSeq={index} setNoticeSeq={setIndex} /> 
                </Portal>
            }
        </>
    );
};
