import React from 'react'
import PropTypes from 'prop-types'

import './ModalImg.css'

function ModalImg(props) {
  const {
    image,
    authorized,
    historyAction,
    closeModal,
    getLikeImg,
    getDirectLinkImg,
  } = props
  let imgModal
  if (image.error) {
    return <p>Ошибка! {image.error}</p>
  }

  if (historyAction === 'POP') {
    imgModal = image.directLinkImage
    if (image.followDirectLinkImg) {
      setTimeout(() => {
        // Фикс ошибки одновременных экшенов
        getDirectLinkImg(image.modalImgId)
      }, 1)
    }
  } else {
    imgModal = image.visibleImgs[image.modalImgId]
  }

  const likeStatus = imgModal.liked_by_user
    ? 'btn-like'
    : 'btn-like btn-like--unactive'

  function showImg() {
    if (imgModal.hasOwnProperty('errors')) {
      return <p>Ошибка! {imgModal.errors}</p>
    }

    if (Object.keys(imgModal).length === 0) {
      return <p>Загрузка...</p>
    } else {
      return (
        <div className="box-img">
          <div className="top">
            <a
              href={imgModal.user.links.html}
              target="_blank"
              rel="noopener noreferrer"
            >
              {imgModal.user.username}
            </a>
            {imgModal.local_date}
            <button
              className={likeStatus}
              onClick={() => (authorized ? getLikeImg(imgModal) : false)}
            >
              {' '}
              {imgModal.likes}
            </button>
          </div>
          <img
            className="modal-img"
            src={imgModal.urls.regular}
            alt={imgModal.alt_description}
          />
        </div>
      )
    }
  }

  return (
    <div className="modal-box">
      <button className="btn-close" onClick={closeModal}>
        X
      </button>
      <div>{showImg()}</div>
    </div>
  )
}

export default ModalImg

ModalImg.propTypes = {
  image: PropTypes.object.isRequired,
  authorized: PropTypes.bool.isRequired,
  historyAction: PropTypes.string.isRequired,
  getLikeImg: PropTypes.func.isRequired,
  getDirectLinkImg: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
}
