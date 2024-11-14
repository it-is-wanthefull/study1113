import { NoticeModalStyled } from './styled';
import { RecoilState, useRecoilState, useResetRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { FC, useEffect, useRef, useState } from 'react';
import { loginInfoState } from '../../../../stores/userInfo';
import { ILoginInfo } from '../../../../models/interface/store/userInfo';
import axios, { AxiosResponse } from 'axios';
import { IDetailResponse, INoticeDetail, IPostResponse } from '../../../../models/interface/INotice';
import { postNoticeApi } from '../../../../api/postNoticeApi';
import { Notice } from '../../../../api/api';

interface INoticeModalProps {
    onSuccess: () => void;
    noticeSeq: number;
    setNoticeSeq: (noticeSeq:number|undefined) => void;
}

export const NoticeModal: FC<INoticeModalProps> = ({ onSuccess, noticeSeq, setNoticeSeq }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState); // recoil에 저장된 state
    const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
    const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();
    const title = useRef<HTMLInputElement>();
    const context = useRef<HTMLInputElement>();

    useEffect(() => {
        noticeSeq && searchDetail();

        return () => {
            noticeSeq && setNoticeSeq(undefined);
        }; // useEffect빈배열(modal열릴때)은 가동될때 작동, return문은 종료될때(modal닫힐때) 작동
        // if (noticeSeq) {
        //     searchDetail();
        //     return () => {
        //         setNoticeSeq(undefined);
        //     }
        // }
    }, []);

    const handlerModal = () => {
        setModal(!modal);
    };

    const searchDetail = async () => {
        const param = {
            noticeSeq,
        }
        const detail = await postNoticeApi<IDetailResponse>(Notice.getDetail, param)
        if (detail) {
            setNoticeDetail(detail.detail);
        }
    }

    const handlerSave = async () => {
        const param = {
            title: title.current.value,
            context: context.current.value,
            loginId: userInfo.loginId,
        };
        const save = await postNoticeApi<IPostResponse>(Notice.getSave, param)
        if (save) {
            save.result === 'success' && onSuccess();
        }
    };

    const handlerUpdate = async () => {
        const param = {
            title: title.current.value,
            context: context.current.value,
            noticeSeq,
        }
        const update = await postNoticeApi<IPostResponse>(Notice.getUpdate, param)
        if (update) {
            update.result === 'success' && onSuccess();
        }
    }

    const handlerDelete = async () => {
        const param = {
            noticeSeq,
        }
        const delete_ = await postNoticeApi<IPostResponse>(Notice.getDelete, param)
        if (delete_) {
            delete_.result === 'success' && onSuccess();
        }
    }

    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :<input type="text" ref={title} defaultValue={noticeDetail?.title}></input>
                </label>
                <label>
                    내용 : <input type="text" ref={context} defaultValue={noticeDetail?.content}></input>
                </label>
                    파일 :<input type="file" id="fileInput" style={{ display: 'none' }}></input>
                <label className="img-label" htmlFor="fileInput">
                    파일 첨부하기
                </label>
                <div>
                    <div>
                        <label>미리보기</label>
                        <img src="" />
                    </div>
                </div>
                <div className={'button-container'}>
                    <button onClick={noticeSeq ? handlerUpdate : handlerSave}>{noticeSeq ? "수정" : "등록"}</button>
                    {noticeSeq && <button onClick={handlerDelete}>삭제</button>}
                    <button onClick={handlerModal}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
};