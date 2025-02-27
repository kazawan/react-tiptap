import { useState } from "react";


const LinkInput = ({ editor, isOpen, setIsOpen }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url && editor) {
            editor
                .chain()
                .focus()
                .insertContent([{
                    type: 'text',
                    marks: [{ type: 'link', attrs: { href: url } }],
                    text: url
                }])
                .run();
        }
        // 清空并关闭
        setUrl('');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <form onSubmit={handleSubmit} className="link-input-form">
            <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
                placeholder="输入URL..."
                autoFocus
            />
            <button type="submit">确认</button>
            <button type="button" onClick={() => setIsOpen(false)}>取消</button>
        </form>
    );
};

export default LinkInput;