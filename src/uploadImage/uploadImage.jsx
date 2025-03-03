import { useEffect, useMemo, useRef, useState } from 'react';
import './uploadImage.css';
import { ImageUp, Upload } from 'lucide-react';

const baseUrl = 'http://localhost:3000'

function UploadImage({ editor, isOpen, setIsOpen }) {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null)
  const [imageAlt, setImageAlt] = useState(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [isPreview, setIsPreview] = useState(false);
  const [history, setHistory] = useState([])


  function handleFileSelect(e) {
    setIsPreview(true)
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result)
    };
    reader.readAsDataURL(file);
    console.log(file)
    setImage(e.target.files[0])
    setImageAlt(e.target.files[0].name)

  }

  function handleClearImage() {
    setImage(null)
    setImageAlt(null)
    setImageSrc(null)
    setIsPreview(false)
    setHistory([])
  }



  function uploadImage() {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image)
    formData.append('image_alt', imageAlt)
    console.log(image)
    console.log(imageAlt)
    fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)

        editor.chain().focus().setImage({ src: baseUrl + '/' + data.image_url, alt: data.image_alt }).run();
        handleClearImage()
        setIsOpen(false)
      })
      .catch(err => console.log(err))
  }




  const Upload_Preview = useMemo(() => {
    if (isPreview) return <div className='upload-item-preview'  >
      <img src={imageSrc} alt="" />
    </div>
    return <div className='upload-item' onClick={() => fileInputRef.current.click()}>
      <ImageUp size={64} color='gray' className='upload-Icon' />
      <input
        type="file"
        name="file"
        accept="image/*"
        className="upload-input"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
    </div>

  }, [isPreview, imageSrc])

  function getHistory() {
    fetch(`${baseUrl}/images`)
      .then(res => res.json())
      .then(data => {
        setHistory(data)
      })
      .catch(err => console.log(err))
  }

  const useGetHistory = useMemo(() => {
    if (history.length === 0) return (<>
      <div>
        no history
      </div>
    </>);
    history.map((item, index) => {
      return <div key={index} className='history-item'>
        <img src={baseUrl + '/' + item.image_url} alt={item.image_alt}
          onClick={() => handleHistoryClick(item)}
        />
        <p>{item.image_alt}</p>
      </div>
    })


  }, [history])

  function handleHistoryClick(image) {
    editor.chain().focus().setImage({ src: baseUrl + '/' + image.image_url, alt: image.image_alt }).run();
    handleClearImage()
    setIsOpen(false)
  }

  function handleExit() {
    setIsOpen(false)
    handleClearImage()
  }




  if (!isOpen) return null;

  return <div
    className="upload-container"
  >
    <form onSubmit={uploadImage}>
      {Upload_Preview}
      <div >
        <button
          type="button"
          className="upload-button"
          onClick={SubmitEvent => uploadImage()}
        >
          <Upload size={16} color='white' style={{ marginRight: '.3rem' }} />
          Upload
        </button>
        <button
          type="button"
          className="upload-button delete"
          onClick={handleClearImage}>
          <span>Clear</span>
        </button>
      </div>

    </form>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>History</h2>
        <button className='get-uploaded'
          onClick={getHistory}
        >Uploaded</button>
        <button className='get-out'
          onClick={handleExit}
        >Exit</button>
      </div>

      <div className='history'>
        {/* {useGetHistory}
         */}
        {
          history.map((item, index) => {
            return (
              <>
                <div>
                  <img src={baseUrl + '/' + item.image_url} alt={item.image_alt}
                    onClick={() => handleHistoryClick(item)}
                  />
                  <p>{item.image_alt}</p>

                </div>

              </>
            )

          })
        }
      </div>
    </div>

  </div>;
}

export default UploadImage;