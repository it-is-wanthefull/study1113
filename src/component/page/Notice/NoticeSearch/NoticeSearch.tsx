import { useEffect, useRef, useState } from 'react';
import { NoticeSearchStyled } from './styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../common/Button/Button';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

export const NoticeSearch = () => {
    const title = useRef<HTMLInputElement>(); // const [title, setTitle] = useState<string>(); 의 경우 title의 한글 초성입력마다 반응하게됨 so useState()대신 useRef()사용
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const [modal, setModal] = useRecoilState(modalState);
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        location.search && navigate(location.pathname, { replace: true });
    }, []); // 의존성배열 반드시 삽입!, 빈배열이면 component가 처음실행된때만을 의미함 아예 안넣으면 무한루프

    const handlerSearch = () => {
            const query: string[] = [];

            !title.current.value || query.push(`searchTitle=${title.current.value}`) // OR연산을 if문처럼 사용할수도 있음
            !startDate || query.push(`searchStDate=${startDate}`)
            !endDate || query.push(`searchEdDate=${endDate}`)

            const queryString = query.length > 0 ? `?${query.join('&')}` : ''; // 각 입력쿼리을 &로 연결하는 단일쿼리로 합체, URL로 전송하기 위함
            navigate(`/react/board/notice.do${queryString}`) // 원랜 Spring서버에 보냈지만 NoticeMain의 useEffect에서 변화감지
    }

    const handlerModal = () => {
        setModal(!modal);
    }

    return (
        <NoticeSearchStyled>
            <div className="input-box">
                <input ref={title}></input>
                <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
                <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
                <Button onClick={handlerSearch}>검색</Button>
                <Button onClick={handlerModal}>등록</Button>
            </div>
        </NoticeSearchStyled>
    );
};
