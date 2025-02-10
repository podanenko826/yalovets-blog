import { PostDataProvider } from './PostDataContext';
import { ModalProvider } from './ModalContext';

const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <PostDataProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </PostDataProvider>
    );
};

export default PostProvider;