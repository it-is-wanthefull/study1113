import { useEffect, useRef, useState } from 'react';
import { NoticeSearchStyled } from './styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../common/Button/Button';

export const NoticeSearch = () => {
    // const [startDate, setStartDate] = useState<string>();
    // const [endDate, setEndDate] = useState<string>();
    // const title = useRef<HTMLInputElement>(null);
    // const navigate = useNavigate();
    // const location = useLocation();

    // useEffect(() => {
    //     location.search && navigate(location.pathname, { replace: true });
    // }, [navigate]);

    // const handlerSearch = () => {
    //     // 검색 버튼을 누르면, 조회가 된다.
    //     const query: string[] = [];
    //     !title.current?.value || query.push(`searchTitle=${title.current?.value}`);
    //     !startDate || query.push(`startDate=${startDate}`);
    //     !endDate || query.push(`endDate=${endDate}`);

    //     const queryString = query.length > 0 ? `?${query.join('&')}` : '';
    //     navigate(`/react/board/notice.do${queryString}`);
    // };

    // const [title, setTitle] = useState<string>();
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const title = useRef<HTMLInputElement>();


    // useEffect(() => {}, []); 빈배열이면 component가 처음실행된때만을 의미함
    // 아래의 경우 title의 한글 초성입력마다 반응하게됨 so useState()대신 useRef()사용
    useEffect(() => {console.log(title, startDate, endDate);}, [title, startDate, endDate]);

    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        location.search && navigate(location.pathname, { replace: true });
    }, []); // 의존성배열 반드시 삽입!, 안넣으면 무한루프

    const handlerSearch = () => {
            const query: string[] = [];

            !title.current.value || query.push(`searchTitle=${title.current.value}`) // OR연산을 if문처럼 사용할수도 있음
            !startDate || query.push(`searchStDate=${startDate}`)
            !endDate || query.push(`searchEdDate=${endDate}`)

            const queryString = query.length > 0 ? `?${query.join('&')}` : ''; // 각 입력쿼리을 &로 연결하는 단일쿼리로 합체, URL로 전송하기 위함
            navigate(`/react/board/notice.do${queryString}`)
    }

    return (
        <NoticeSearchStyled>
            <div className="input-box">
                <input ref={title}></input>
                <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
                <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
                <Button onClick={handlerSearch}>검색</Button>
                {/* <Button onClick={handlerModal}>등록</Button> */}
            </div>
        </NoticeSearchStyled>
    );
};
