import { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
    children: ReactNode; // ReactDOM은 문자열/if문 등까지 인식
}

export const Portal: FC<PortalProps> = ({ children }) => {
    return ReactDOM.createPortal(children, document.body);
};
