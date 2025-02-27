

function Test({ editor, isOpen, setIsOpen }) {

    function insertContent() {
        editor
            .chain()
            .focus()
            .insertContent([{
                type: 'text',
                text: 'Test'
            }])
            .run();
            setIsOpen(false)

        const json = editor.getJSON()   
        console.log(json)
    }

    if (!isOpen) return null;

  return <div
    className="link-test-form"  onClick={() => insertContent()}
  >Test</div>;
}

export default Test;