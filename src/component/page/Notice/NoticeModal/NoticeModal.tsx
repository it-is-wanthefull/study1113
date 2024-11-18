import { NoticeModalStyled } from './styled';
import { RecoilState, useRecoilState, useResetRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { loginInfoState } from '../../../../stores/userInfo';
import { ILoginInfo } from '../../../../models/interface/store/userInfo';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
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
    const [imageUrl, setImageUrl] = useState<string>();
    const [fileData, setFileData] = useState<File>();
    const title = useRef<HTMLInputElement>();
    const context = useRef<HTMLInputElement>();

    useEffect(() => {
        noticeSeq && searchDetail();

        return () => {
            noticeSeq && setNoticeSeq(undefined);
        };
    }, []);

    const handlerModal = () => {
        setModal(!modal);
    };

    const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInfo = e.target.files;
        if(fileInfo?.length > 0) {
            const fileInfoSplit = fileInfo[0].name.split('.');
            const fileLowerCase = fileInfoSplit[1].toLowerCase();
            
            if (fileLowerCase === "jpg" || fileLowerCase === "gif" || fileLowerCase === "png") {
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            }
            else {
                setImageUrl('')
            }
            setFileData(fileInfo[0])
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

    const handlerFileSave = async () => {
        const fileForm = new FormData();
        const textData = {
            title: title.current.value,
            context: context.current.value,
            loginId: userInfo.loginId,
        };
        fileData && fileForm.append('file', fileData);
        fileForm.append('text', new Blob([JSON.stringify(textData)], {type: 'application/json'}));
        const save = await postNoticeApi<IPostResponse>(Notice.getFileSave, fileForm)
        if (save) {
            save.result === 'success' && onSuccess();
        }
    };

    const searchDetail = async () => {
        const param = {
            noticeSeq,
        }
        const detail = await postNoticeApi<IDetailResponse>(Notice.getDetail, param)
        if (detail) {
            setNoticeDetail(detail.detail);
            const { fileExt, logicalPath } = detail.detail;
            if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                setImageUrl(logicalPath);
            } else {
                setImageUrl('');
            }
        }
    }

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

    const handlerFileUpdate = async () => {
        const fileForm = new FormData();
        const textData = {
            title: title.current.value,
            context: context.current.value,
            noticeSeq,
        };
        fileData && fileForm.append('file', fileData);
        fileForm.append('text', new Blob([JSON.stringify(textData)], {type: 'application/json'}));
        const save = await postNoticeApi<IPostResponse>(Notice.getFileUpdate, fileForm)
        if (save) {
            save.result === 'success' && onSuccess();
        }
    };

    const handlerDelete = async () => {
        const param = {
            noticeSeq,
        }
        const delete_ = await postNoticeApi<IPostResponse>(Notice.getDelete, param)
        if (delete_) {
            delete_.result === 'success' && onSuccess();
        }
    }

    const handlerFileDelete = async () => {
        const fileForm = new FormData();
        const textData = {
            title: title.current.value,
            context: context.current.value,
            noticeSeq,
        };
        fileData && fileForm.append('file', fileData);
        fileForm.append('text', new Blob([JSON.stringify(textData)], {type: 'application/json'}));
        const save = await postNoticeApi<IPostResponse>(Notice.getFileUpdate, fileForm)
        if (save) {
            save.result === 'success' && onSuccess();
        }
    };
    
    const downloadFile = async () => {
        const param = new URLSearchParams();
        param.append('noticeSeq', noticeSeq.toString());

        const postAction: AxiosRequestConfig = {
            url: '/board/noticeDownload.do',
            method: 'POST',
            data: param,
            responseType: 'blob', // binary타입
        };

        await axios(postAction)
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', noticeDetail?.fileName as string); // as는 약간 불확신한 타입에 대하 string를 의도했다는 개발자의 명시
                document.body.appendChild(link);
                link.click(); // 사용자에겐 안보이는 a태그를 작동시키기 위함

                link.remove();
            });
    };


    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :<input type="text" ref={title} defaultValue={noticeDetail?.title}></input>
                </label>
                <label>
                    내용 : <input type="text" ref={context} defaultValue={noticeDetail?.content}></input>
                </label>
                    파일 :<input type="file" id="fileInput" style={{ display: 'none' }} onChange={handlerFile}></input>
                <label className="img-label" htmlFor="fileInput">
                    파일 첨부하기
                </label>
                <div onClick = {downloadFile}>
                    {imageUrl ?
                        <div>
                            <label>미리보기</label>
                            <img src={imageUrl} />
                            {fileData?.name || noticeDetail.fileName}
                        </div>
                        :
                        <div>
                            {fileData?.name}
                        </div>
                    }
                </div>
                <div className={'button-container'}>
                    <button onClick={noticeSeq ? (fileData ? handlerFileUpdate : handlerUpdate) : (fileData ? handlerFileSave : handlerSave)}>{noticeSeq ? "수정" : "등록"}</button>
                    {noticeSeq && <button onClick={fileData ? handlerFileDelete : handlerDelete}>삭제</button>}
                    <button onClick={handlerModal}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
};